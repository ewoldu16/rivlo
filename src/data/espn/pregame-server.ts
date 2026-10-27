import 'server-only';
import {historicalComparison} from './historical-comparison';
import {cached,getSummary} from './server';
import {readEcosystemResource} from './ecosystem-server';
import {mapSummary} from './mapping';
import {object} from './ecosystem-mapping';
import {comparisonStandings,comparisonStatistics,comparisonSchedule} from './pregame-mapping';
import {teamComparisonSchema,verifiedResults,type TeamComparison,type ComparisonSide} from '../../domain/team-comparison';
const SITE='https://site.api.espn.com/apis/site/v2/sports/basketball/nba/';
export async function getPregameComparison(id:string):Promise<TeamComparison>{
 const result=await cached('pregame:2.2.1:'+id,async()=>{
  const summary=await getSummary(id),game=mapSummary(summary.value.raw,summary.value.fetchedAt),header=object(object(summary.value.raw).header),rawSeason=header.season?object(header.season):{},season=Number.isInteger(rawSeason.year)&&Number(rawSeason.year)>=2024&&Number(rawSeason.year)<=2027?Number(rawSeason.year):null,phase=rawSeason.type===1||rawSeason.type===2||rawSeason.type===3?rawSeason.type:null;
  const empty=(team:ComparisonSide['team']):ComparisonSide=>({team,metrics:[],standing:null,split:null,recent:[],notes:[]});
  const model:TeamComparison={gameId:game.id,source:'ESPN',season,phase,asOf:summary.value.fetchedAt,cutoff:game.start,stale:summary.stale,warnings:[],away:empty(game.awayTeam!),home:empty(game.homeTeam!),meetings:[],historySeasons:[],broadcasts:game.broadcasts||[]};
  if(!season||!phase){model.warnings.push('The game season or competition could not be verified. Season statistics and results are withheld.');return teamComparisonSchema.parse(model)}
  const times=[summary.value.fetchedAt];
  async function load<T>(url:string,map:(raw:unknown)=>T,label:string,fallback:T,historical=false):Promise<T>{try{const response=await readEcosystemResource(url,historical?3600000:300000);const mapped=map(response.value.raw);model.stale||=response.stale;times.push(response.value.at);return mapped}catch{model.warnings.push(label+' unavailable or not verified for this competition.');return fallback}}
  const q=`?season=${season}&seasontype=${phase}`;
  const standings=await load(`https://site.api.espn.com/apis/v2/sports/basketball/nba/standings${q}`,raw=>({away:comparisonStandings(raw,season,phase,game.away,'road'),home:comparisonStandings(raw,season,phase,game.home,'home')}),'Standings',null);
  const [awayResults,homeResults,awayMetrics,homeMetrics,historyResults,historical]=await Promise.all([
   load(SITE+`teams/${game.away.replace('espn-team-','')}/schedule${q}`,raw=>comparisonSchedule(raw,game.away.replace('espn-team-',''),season,phase),'Away schedule',{games:[],omitted:0}),
   load(SITE+`teams/${game.home.replace('espn-team-','')}/schedule${q}`,raw=>comparisonSchedule(raw,game.home.replace('espn-team-',''),season,phase),'Home schedule',{games:[],omitted:0}),
   load(SITE+`teams/${game.away.replace('espn-team-','')}/statistics${q}`,raw=>comparisonStatistics(raw,game.away,season,phase),'Away statistics',[]),
   load(SITE+`teams/${game.home.replace('espn-team-','')}/statistics${q}`,raw=>comparisonStatistics(raw,game.home,season,phase),'Home statistics',[]),
   season>2024?load(SITE+`teams/${game.away.replace('espn-team-','')}/schedule?season=${season-1}&seasontype=${phase}`,raw=>comparisonSchedule(raw,game.away.replace('espn-team-',''),season-1,phase),'Previous-season meetings',{games:[],omitted:0},true):Promise.resolve({games:[],omitted:0}),
   phase===2&&season>2024?historicalComparison(game.away,game.home,season-1):Promise.resolve(null),
  ]);
  model.historical=historical;
  const awaySchedule=awayResults.games,homeSchedule=homeResults.games,history=historyResults.games;
  if(awayResults.omitted+homeResults.omitted+historyResults.omitted>0)model.warnings.push('Some schedule entries could not be verified and were omitted. Recent form and meetings show published, verified results only.');
  for(const [side,schedule,metrics] of [['away',awaySchedule,awayMetrics],['home',homeSchedule,homeMetrics]] as const){const target=model[side],row=standings?.[side];target.standing=row?.standing||null;target.split=row?.split||null;const zeroGames=target.standing?.record?.wins===0&&target.standing.record.losses===0;target.metrics=zeroGames?[]:[...new Map([...(row?.metrics||[]),...metrics].map(m=>[m.key,m])).values()];target.recent=verifiedResults(schedule.filter(g=>g.home===target.team.id||g.away===target.team.id),season,phase,game.start).slice(0,5);if(!target.metrics.length)target.notes.push(zeroGames?'No completed games are recorded for this competition yet.':'Season statistics are not currently verified.');if(!schedule.length)target.notes.push('The published schedule is empty or unavailable.');}
  const current=verifiedResults([...awaySchedule,...homeSchedule],season,phase,game.start),previous=verifiedResults(history,season-1,phase,game.start);model.meetings=[...new Map([...current,...previous].filter(g=>[g.home.id,g.away.id].includes(game.home)&&[g.home.id,g.away.id].includes(game.away)).map(g=>[g.id,g])).values()].sort((a,b)=>b.start.localeCompare(a.start)).slice(0,10);model.historySeasons=season>2024?[season,season-1]:[season];model.asOf=times.sort()[0];
  return teamComparisonSchema.parse(model);
 },()=>300000);
 return {...result.value,stale:result.stale||result.value.stale};
}
