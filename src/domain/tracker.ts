import {z} from 'zod';
import {gameSchema,normalizedTeamSchema,type Game} from './nba';
import {playerSchema,type Stat} from './ecosystem';
import {boxDataSchema} from './explore-contracts';

export const categories={PTS:['PTS'],REB:['REB'],AST:['AST'],'3PM':['3PM'],STL:['STL'],BLK:['BLK'],PR:['PTS','REB'],PA:['PTS','AST'],RA:['REB','AST'],PRA:['PTS','REB','AST']} as const;
export type Category=keyof typeof categories;
export const featureLimits={free:{targets:5,collections:1},premium:{targets:Infinity,collections:Infinity}};
export const trackerPlan:'free'|'premium'='free';
export const targetSchema=z.object({id:z.string().uuid(),gameId:z.string().regex(/^espn-\d{1,15}$/),player:playerSchema,team:normalizedTeamSchema,opponent:normalizedTeamSchema,start:z.string().datetime(),category:z.enum(['PTS','REB','AST','3PM','STL','BLK','PR','PA','RA','PRA']),operator:z.enum(['at-least','at-most']),threshold:z.number().finite().nonnegative().max(10000),collectionId:z.string().uuid().nullable(),archived:z.boolean().default(false)});
export type Target=z.infer<typeof targetSchema>;
export const trackerSchema=z.object({version:z.literal(1),targets:z.array(targetSchema).max(10000),collections:z.array(z.object({id:z.string().uuid(),name:z.string().trim().min(1).max(60)})).max(1000)}).superRefine((v,c)=>{if(new Set(v.targets.map(t=>t.id)).size!==v.targets.length||new Set(v.collections.map(t=>t.id)).size!==v.collections.length||v.targets.some(t=>t.collectionId&&!v.collections.some(g=>g.id===t.collectionId)))c.addIssue({code:'custom',message:'Invalid tracker identities or collection references.'});});
export type TrackerStore=z.infer<typeof trackerSchema>;
export const emptyTracker=():TrackerStore=>({version:1,targets:[],collections:[]});
export function parseTracker(raw:string|null){return trackerSchema.parse(JSON.parse(raw||JSON.stringify(emptyTracker())));}
export const trackerGameSchema=z.object({game:gameSchema.extend({homeTeam:normalizedTeamSchema,awayTeam:normalizedTeamSchema}),box:boxDataSchema,participants:z.array(z.object({player:playerSchema,team:normalizedTeamSchema,provisional:z.boolean()})),fetchedAt:z.string().datetime(),stale:z.boolean(),warnings:z.array(z.string())});
export type TrackerGame=z.infer<typeof trackerGameSchema>;
const aliases:Record<string,string[]>={PTS:['PTS','points'],REB:['REB','totalRebounds','rebounds'],AST:['AST','assists'],STL:['STL','steals'],BLK:['BLK','blocks']};
export function statValue(stats:Stat[],category:Category):number|null {
 const component=(key:string)=>{const s=stats.find(s=>(aliases[key]||['3PM','threePointFieldGoalsMade']).some(a=>a===s.label||a===s.key));if(s&&/^\d+$/.test(s.value)&&Number.isSafeInteger(Number(s.value)))return Number(s.value);if(key==='3PM'){const pair=stats.find(s=>s.label==='3PT'||s.key==='threePointFieldGoalsMade-threePointFieldGoalsAttempted');if(pair&&/^\d+-\d+$/.test(pair.value)){const [made,attempts]=pair.value.split('-').map(Number);if(Number.isSafeInteger(made)&&Number.isSafeInteger(attempts)&&made<=attempts)return made;}}return null;};
 const parts=categories[category].map(component);return parts.some(v=>v===null)?null:parts.reduce<number>((sum,v)=>sum+v!,0);
}
export function targetProgress(target:Target,data?:TrackerGame,error?:string,now=Date.now()):{value:number|null;status:string;detail:string;progress:number|null} {
 const unavailable=(detail:string)=>({value:null,status:'Unavailable',detail,progress:null});
 if(error)return unavailable('Feed unavailable. Retry to check official statistics.');
 if(!data)return unavailable('Waiting for verified game data.');
 if(data.game.id!==target.gameId)return unavailable('Game identity mismatch.');
 if(data.stale||(data.game.status==='in-progress'&&now-Date.parse(data.fetchedAt)>180000))return unavailable('Delayed feed · last verified data is out of date.');
 const g:Game=data.game;
 if(g.status==='postponed'||g.status==='cancelled'||g.status==='unknown')return unavailable(g.statusText||g.status);
 if(g.status==='upcoming')return {value:null,status:'Upcoming',detail:'No game statistics yet. Participation is not confirmed.',progress:null};
 const row=data.box.groups.find(g=>g.team.id===target.team.id)?.rows.find(r=>r.player.id===target.player.id);
 if(!row)return unavailable('Player statistics have not been published.');
 if(row.didNotPlay)return unavailable('DNP · no participation recorded.');
 const value=statValue(row.stats,target.category);if(value===null)return unavailable('Required statistic is missing or invalid.');
 const final=g.status==='completed',reached=target.operator==='at-least'?value>=target.threshold:value<=target.threshold;
 const status=final?(reached?'Reached':'Not reached'):target.operator==='at-least'&&reached?'Reached':'Live';
 return {value,status,detail:final?'Final · official corrections may change this result.':target.operator==='at-most'?'In progress · at most is settled only at final.':'In progress · subject to official corrections.',progress:target.threshold===0?(value===0?0:100):Math.min(100,value/target.threshold*100)};
}
