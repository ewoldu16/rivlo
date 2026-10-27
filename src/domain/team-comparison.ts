import {z} from 'zod';
import {normalizedTeamSchema,type Game,displayScore} from './nba';

export const competitionLabel=(phase:number|null)=>phase===1?'Preseason':phase===2?'Regular season':phase===3?'Postseason':'Competition unverified';
export const metricDefinitions=[
 {key:'avgPoints',label:'Points',short:'PPG',category:'Scoring',unit:'per game',direction:'higher',help:'Points scored per game. Higher describes greater scoring output, not an overall team ranking.'},
 {key:'avgPointsAgainst',label:'Opponent points',short:'OPP PPG',category:'Defence',unit:'per game',direction:'lower',help:'Points conceded per game. Lower is generally preferable; opponent strength and pace also matter.'},
 {key:'fieldGoalPct',label:'Field goals',short:'FG%',category:'Scoring',unit:'percent',direction:'higher',help:'Field goals made divided by field goals attempted, expressed as a percentage.'},
 {key:'threePointPct',label:'Three-pointers',short:'3P%',category:'Scoring',unit:'percent',direction:'higher',help:'Three-point field goals made divided by three-point attempts, expressed as a percentage.'},
 {key:'freeThrowPct',label:'Free throws',short:'FT%',category:'Scoring',unit:'percent',direction:'higher',help:'Free throws made divided by free throws attempted, expressed as a percentage.'},
 {key:'avgRebounds',label:'Rebounds',short:'RPG',category:'Rebounding',unit:'per game',direction:'higher',help:'Total offensive and defensive rebounds per game.'},
 {key:'avgAssists',label:'Assists',short:'APG',category:'Playmaking',unit:'per game',direction:'higher',help:'Assists credited per game. This measures output, not an overall team advantage.'},
 {key:'avgTurnovers',label:'Turnovers',short:'TOV',category:'Playmaking',unit:'per game',direction:'lower',help:'Possessions lost through turnovers per game. Lower is generally preferable.'},
 {key:'avgSteals',label:'Steals',short:'SPG',category:'Defence',unit:'per game',direction:'higher',help:'Steals credited per game. Higher describes output rather than overall defensive quality.'},
 {key:'avgBlocks',label:'Blocks',short:'BPG',category:'Defence',unit:'per game',direction:'higher',help:'Blocked shots credited per game.'},
 {key:'assistTurnoverRatio',label:'Assist / turnover',short:'AST/TOV',category:'Playmaking',unit:'ratio',direction:'higher',help:'Provider-reported assists per turnover. This ratio is not calculated from rounded per-game figures.'},
 {key:'avgOffensiveRebounds',label:'Offensive rebounds',short:'OREB',category:'Rebounding',unit:'per game',direction:'higher',help:'Offensive rebounds per game, not a season total.'},
 {key:'avgDefensiveRebounds',label:'Defensive rebounds',short:'DREB',category:'Rebounding',unit:'per game',direction:'higher',help:'Defensive rebounds per game, not a season total.'},
] as const;
export type MetricDefinition=typeof metricDefinitions[number];
export const comparisonCategories=['Scoring','Playmaking','Rebounding','Defence','Advanced'] as const;
const metricSchema=z.object({key:z.enum(metricDefinitions.map(m=>m.key)),value:z.number().finite().nonnegative(),display:z.string(),source:z.enum(['team-statistics','standings'])});
export const historicalComparisonSchema=z.object({season:z.number().int(),phase:z.literal(2),awayTeamId:z.string(),homeTeamId:z.string(),asOf:z.string().datetime(),stale:z.boolean(),awayMetrics:z.array(metricSchema),homeMetrics:z.array(metricSchema)});
const recordSchema=z.object({wins:z.number().int().nonnegative(),losses:z.number().int().nonnegative(),pct:z.number().min(0).max(100).nullable()});
export const recentResultSchema=z.object({id:z.string().regex(/^espn-\d+$/),start:z.string().datetime(),season:z.number().int(),phase:z.union([z.literal(1),z.literal(2),z.literal(3)]),home:normalizedTeamSchema,away:normalizedTeamSchema,homeScore:z.number().int().nonnegative(),awayScore:z.number().int().nonnegative()}).refine(g=>g.home.id!==g.away.id&&g.homeScore!==g.awayScore,'Unresolved result');
export type RecentResult=z.infer<typeof recentResultSchema>;
const sideSchema=z.object({team:normalizedTeamSchema,metrics:z.array(metricSchema),standing:z.object({conference:z.string(),rank:z.number().int().positive().nullable(),record:recordSchema.nullable()}).nullable(),split:recordSchema.nullable(),recent:z.array(recentResultSchema),notes:z.array(z.string())});
export const teamComparisonSchema=z.object({gameId:z.string(),source:z.enum(['ESPN','demo']),season:z.number().int().nullable(),phase:z.union([z.literal(1),z.literal(2),z.literal(3)]).nullable(),asOf:z.string().datetime(),cutoff:z.string().datetime(),stale:z.boolean(),warnings:z.array(z.string()),away:sideSchema,home:sideSchema,meetings:z.array(recentResultSchema),historySeasons:z.array(z.number().int()),broadcasts:z.array(z.string()),historical:historicalComparisonSchema.nullable().optional()}).refine(d=>d.away.team.id!==d.home.team.id,'Teams must differ').refine(d=>!d.historical||d.phase===2&&d.season!==null&&d.historical.season===d.season-1&&d.historical.awayTeamId===d.away.team.id&&d.historical.homeTeamId===d.home.team.id&&d.historical.awayMetrics.some(a=>d.historical!.homeMetrics.some(h=>h.key===a.key)),'Historical comparison context must match both teams and the previous regular season');
export type TeamComparison=z.infer<typeof teamComparisonSchema>;
export type ComparisonSide=TeamComparison['away'];

/** Bars describe a single metric's typical direction, never an overall winner. */
export function comparisonShares(away:number|undefined,home:number|undefined,direction:MetricDefinition['direction']){if(away===undefined||home===undefined)return null;if(away+home===0)return [.5,.5] as const;return direction==='lower'?[home/(away+home),away/(away+home)] as const:[away/(away+home),home/(away+home)] as const;}
export function verifiedResults(games:Game[],season:number,phase:1|2|3,cutoff:string){return [...new Map(games.filter(g=>g.status==='completed'&&g.start<cutoff).flatMap(g=>{const parsed=recentResultSchema.safeParse({id:g.id,start:g.start,season,phase,home:g.homeTeam,away:g.awayTeam,homeScore:displayScore(g,'home'),awayScore:displayScore(g,'away')});return parsed.success?[[g.id,parsed.data] as const]:[]})).values()].sort((a,b)=>b.start.localeCompare(a.start));}

export function resultWinner(game:RecentResult){return game.homeScore>game.awayScore?game.home:game.away;}
