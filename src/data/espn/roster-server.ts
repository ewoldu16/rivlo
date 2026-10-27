import 'server-only';
import {cached} from './server';
import {readEcosystemResource} from './ecosystem-server';
import {mapRoster,mapPlayerLogs,mapStandings,mapRosterInjury,array,object,text} from './ecosystem-mapping';
import {seasonForGame} from '@/domain/ecosystem';
import {rosterAverages,rosterPayloadSchema} from '@/domain/roster';
export function currentRosterSeason(){return seasonForGame(new Date().toISOString());}
export async function getTeamRoster(id:string,season:number){return cached(`game-roster:${id}:${season}`,async()=>{
 const current=currentRosterSeason(),warnings:string[]=[],times:string[]=[];let stale=false;
 async function get(url:string){const r=await readEcosystemResource(url);stale||=r.stale;times.push(r.value.at);return r.value.raw;}
 const raw=await get(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${id}/roster?season=${current}`),roster=mapRoster(raw,id,current);
 if(new Set(roster.players.map(p=>p.id)).size!==roster.players.length)throw Error('Duplicate roster identities.');
 const standing=await get(`https://site.api.espn.com/apis/v2/sports/basketball/nba/standings?season=${current}&seasontype=2`).then(d=>mapStandings(d,current,2).find(s=>s.team.id==='espn-team-'+id)||null).catch(()=>{warnings.push('Current-season standings unavailable.');return null;});
 const entries=[];
 // Bounded concurrency; logs share the existing five-minute provider cache.
 for(let i=0;i<roster.players.length;i+=4){entries.push(...await Promise.all(roster.players.slice(i,i+4).map(async player=>{
  const athlete=array(object(raw).athletes).map(object).find(p=>text(p.id)===player.id)!;
  const injury=mapRosterInjury(athlete.injuries);
  const logs=await get(`https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${player.id}/gamelog?season=${season}`).then(d=>mapPlayerLogs(d,player.id,season,2)).catch(()=>{warnings.push(`${player.name}: season statistics unavailable.`);return [];});
  return {player,injury,stats:rosterAverages(logs),games:logs.length};
 })));}
 return rosterPayloadSchema.parse({teamId:'espn-team-'+id,rosterSeason:current,season,standing,entries,fetchedAt:times.sort()[0],stale,warnings});
 },()=>300000);}
