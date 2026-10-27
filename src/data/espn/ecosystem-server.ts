import 'server-only';
import {cached,getEspnTeams,getSummary} from './server';
import {mapTeam} from './mapping';
import {array,object,text,mapPlayer,mapRoster,mapStandings,mapSchedule,mapPlayerLogs,averages,mapTeamStatistics,mapDivision} from './ecosystem-mapping';
import type {Stat} from '../../domain/ecosystem';
const SITE='https://site.api.espn.com/apis/site/v2/sports/basketball/nba/';
const WEB='https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/';
const CORE='https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba/';
export async function readEcosystemResource(url:string,ttl=300000){return cached('ecosystem:'+url,async()=>{const r=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(10000)});if(!r.ok)throw new Error(r.status===404?'Not published for this season.':'Provider unavailable.');const body=await r.text();if(body.length>5_000_000)throw new Error('Provider response exceeded limit.');return {raw:JSON.parse(body) as unknown,at:new Date().toISOString()};},()=>ttl);}
async function divisionIndex(season:number,phase:number){return cached('division-index:'+season+':'+phase,async()=>{let stale=false;const at:string[]=[];const load=async(url:string)=>{const r=await readEcosystemResource(url);stale||=r.stale;at.push(r.value.at);return r.value.raw;};const collections=await Promise.all([5,6].map(c=>load(CORE+`seasons/${season}/types/${phase}/groups/${c}/children?limit=100`)));const ids=collections.flatMap(d=>array(object(d).items).map(v=>text(object(v).$ref).match(/\/groups\/(\d+)\?/ )?.[1])).filter((id):id is string=>!!id);const groups=await Promise.all(ids.map(async gid=>{const base=CORE+`seasons/${season}/types/${phase}/groups/${gid}`;const [meta,standings]=await Promise.all([load(base),load(base+'/standings/0')]);return mapDivision(meta,standings,season,phase);}));return {rows:groups.flat(),stale,at:at.sort()[0]};},()=>300000);}
export async function explore(kind:string,id:string,season:number,phase:number){const warnings:string[]=[];let stale=false;const times:string[]=[];async function get(url:string){const r=await readEcosystemResource(url);stale||=r.stale;times.push(r.value.at);return r.value.raw;}async function optional<T>(label:string,task:()=>Promise<T>,fallback:T){try{return await task();}catch(e){warnings.push(label+': '+(e instanceof Error?e.message:'Unavailable'));return fallback;}}
 const q=`?season=${season}&seasontype=${phase}`;
 const standings=async()=>mapStandings(await get(`https://site.api.espn.com/apis/v2/sports/basketball/nba/standings${q}`),season,phase);
 let data:unknown;
 if(kind==='directory'){const r=await getEspnTeams();stale=r.stale;data={teams:r.value};}
 else if(kind==='standings'){data={rows:await standings()};}
 else if(kind==='team'){
 const raw=object(await get(SITE+'teams/'+id)),team=mapTeam(raw.team);if(team.id!=='espn-team-'+id)throw new Error('Team identity did not match.');
 const [rows,roster,schedule,statistics,division,leaders]=await Promise.all([
 optional('Standings',standings,[]),optional('Roster',async()=>mapRoster(await get(SITE+`teams/${id}/roster?season=${season}`),id,season),null),optional('Schedule',async()=>mapSchedule(await get(SITE+`teams/${id}/schedule${q}`),id,season,phase),[]),
 optional('Team statistics',async()=>mapTeamStatistics(await get(SITE+`teams/${id}/statistics${q}`),id,season,phase),[] as Stat[]),
 optional('Division',async()=>{const index=await divisionIndex(season,phase);stale||=index.stale||index.value.stale;times.push(index.value.at);return index.value.rows.find(r=>r.teamId===team.id)||null;},null),
 optional('Leaders',async()=>{const d=object(await get(CORE+`seasons/${season}/types/${phase}/teams/${id}/leaders`));if(!text(d.$ref).includes(`/seasons/${season}/types/${phase}/teams/${id}/leaders`))throw new Error('Leader season did not match.');const cats=array(d.categories).map(object).filter(c=>['pointsPerGame','reboundsPerGame','assistsPerGame'].includes(text(c.name)));return Promise.all(cats.map(async c=>{const l=object(array(c.leaders)[0]),ref=text(object(l.athlete).$ref),pid=ref.match(new RegExp(`/seasons/${season}/athletes/(\\d+)`))?.[1];if(!pid)throw new Error('Leader identity missing.');const player=mapPlayer(object(await get(WEB+'athletes/'+pid)).athlete);return {player,teamId:team.id,season,phase,label:text(c.displayName),value:text(l.displayValue)};}));},[])
 ]);
 data={team,division:division?.division??null,divisionRank:division?.rank??null,standing:rows.find(r=>r.team.id===team.id)||null,context:rows.filter(r=>r.conference===rows.find(r=>r.team.id===team.id)?.conference),roster:roster?.players??[],rosterPhase:roster?.phase??null,rosterVerified:!!roster,schedule,statistics,leaders};
 }else if(kind==='player'){
 const raw=object(await get(WEB+'athletes/'+id)),p=object(raw.athlete),player=mapPlayer(p);if(player.id!==id)throw new Error('Player identity did not match.');const team=p.team?mapTeam(p.team):null;
 const [logs,roster]=await Promise.all([optional('Player game logs',async()=>mapPlayerLogs(await get(WEB+`athletes/${id}/gamelog?season=${season}`),id,season,phase),[]),team?optional('Team association',async()=>mapRoster(await get(SITE+`teams/${team.id.replace('espn-team-','')}/roster?season=${season}`),team.id.replace('espn-team-',''),season),null):null]);
 data={player,team,associationVerified:!!roster?.players.some(p=>p.id===id),logs,averages:averages(logs),career:{experience:text(p.displayExperience),draft:text(p.displayDraft),birthplace:text(p.displayBirthPlace)}};
 }else if(kind==='box'){
 const summary=await getSummary(id);stale||=summary.stale;times.push(summary.value.fetchedAt);const d=object(summary.value.raw),header=object(d.header),s=object(header.season||{});if(text(header.id)!==id)throw new Error('Game identity did not match.');data={season:s.year??null,phase:s.type??null,groups:array(object(d.boxscore||{}).players).map(rawGroup=>{const g=object(rawGroup);return {team:mapTeam(g.team),rows:array(g.statistics).flatMap(block=>{const b=object(block),labels=array(b.labels).map(text),keys=array(b.keys).map(text);return array(b.athletes).map(rawRow=>{const r=object(rawRow);return {player:mapPlayer(r.athlete),starter:r.starter===true,didNotPlay:r.didNotPlay===true,stats:array(r.stats).map((v,i)=>({key:keys[i]||labels[i]||String(i),label:labels[i]||keys[i]||String(i),value:text(v)}))};});})};})};
 }else throw new Error('Unsupported resource.');
 return {data,season,phase,stale,fetchedAt:times.sort()[0]||new Date().toISOString(),warnings};
}

export async function trackerRoster(id:string,season:number){const r=await readEcosystemResource(SITE+'teams/'+id+'/roster?season='+season);return {players:mapRoster(r.value.raw,id,season).players,stale:r.stale};}
