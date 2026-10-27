import 'server-only';
import {cached} from './server';
import {readEcosystemResource} from './ecosystem-server';
import {comparisonStandings,comparisonStatistics} from './pregame-mapping';
import {historicalComparisonSchema} from '../../domain/team-comparison';
const SITE='https://site.api.espn.com/apis/site/v2/sports/basketball/nba/';
/** Statistics only: historical records must never replace current matchup context. */
export async function historicalComparison(away:string,home:string,season:number){
 const entry=await cached(`historical-comparison:${season}:${away}:${home}`,async()=>{
  const read=async(url:string)=>{try{return await readEcosystemResource(url,3600000)}catch{return null}};
  const [standing,awayStats,homeStats]=await Promise.all([read(`https://site.api.espn.com/apis/v2/sports/basketball/nba/standings?season=${season}&seasontype=2`),read(SITE+`teams/${away.replace('espn-team-','')}/statistics?season=${season}&seasontype=2`),read(SITE+`teams/${home.replace('espn-team-','')}/statistics?season=${season}&seasontype=2`)]);
  const metrics=(id:string,setting:'home'|'road',raw:typeof awayStats)=>{let row:ReturnType<typeof comparisonStandings>|null=null,stats:ReturnType<typeof comparisonStatistics>=[];try{if(standing)row=comparisonStandings(standing.value.raw,season,2,id,setting)}catch{}try{if(raw)stats=comparisonStatistics(raw.value.raw,id,season,2)}catch{}if(row?.standing?.record?.wins===0&&row.standing.record.losses===0)return [];return [...new Map([...(row?.metrics||[]),...stats].map(m=>[m.key,m])).values()]};
  const awayMetrics=metrics(away,'road',awayStats),homeMetrics=metrics(home,'home',homeStats);if(!awayMetrics.some(a=>homeMetrics.some(h=>h.key===a.key)))return null;
  const sources=[standing,awayStats,homeStats].filter(s=>s!==null);
  return historicalComparisonSchema.parse({season,phase:2,awayTeamId:away,homeTeamId:home,awayMetrics,homeMetrics,asOf:sources.map(s=>s.value.at).sort()[0],stale:sources.some(s=>s.stale)});
 },value=>value?3600000:300000);
 return entry.value?{...entry.value,stale:entry.stale||entry.value.stale}:null;
}
