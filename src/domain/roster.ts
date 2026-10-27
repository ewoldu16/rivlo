import {z} from 'zod';
import {playerSchema,standingSchema,type PlayerLog} from './ecosystem';
export const rosterStats=['PPG','RPG','APG','FG%','3P%','MPG','SPG','BPG'] as const;
export type RosterStat=typeof rosterStats[number];
export const rosterEntrySchema=z.object({player:playerSchema,injury:z.object({status:z.enum(['Questionable','Doubtful','Out','Probable']),date:z.string()}).nullable(),stats:z.record(z.string(),z.number().finite().nonnegative()),games:z.number().int().nonnegative()});
export type RosterEntry=z.infer<typeof rosterEntrySchema>;
export const rosterPayloadSchema=z.object({teamId:z.string(),rosterSeason:z.number(),season:z.number(),standing:standingSchema.nullable(),entries:z.array(rosterEntrySchema),fetchedAt:z.string(),stale:z.boolean(),warnings:z.array(z.string())});
export type RosterPayload=z.infer<typeof rosterPayloadSchema>;
export function rosterAverages(logs:PlayerLog[]){const stats:Record<string,number>={};
 for(const [label,key] of [['PPG','points'],['RPG','totalRebounds'],['APG','assists'],['MPG','minutes'],['SPG','steals'],['BPG','blocks']]){const values=logs.map(l=>l.stats.find(s=>s.key===key)?.value);if(values.length&&values.every(v=>v!==undefined&&/^\d+(\.\d+)?$/.test(v)))stats[label]=values.reduce((n,v)=>n+Number(v),0)/values.length;}
 for(const [label,key] of [['FG%','fieldGoalsMade-fieldGoalsAttempted'],['3P%','threePointFieldGoalsMade-threePointFieldGoalsAttempted']]){const pairs=logs.map(l=>l.stats.find(s=>s.key===key)?.value);if(pairs.length&&pairs.every(v=>v!==undefined&&/^\d+-\d+$/.test(v)&&Number(v.split('-')[0])<=Number(v.split('-')[1]))){const totals=pairs.reduce((a,v)=>{const [m,t]=v!.split('-').map(Number);return [a[0]+m,a[1]+t]},[0,0]);if(totals[1])stats[label]=100*totals[0]/totals[1];}}
 return stats;
}
export function selectRoster(entries:RosterEntry[],position:string,sort:string,stat:RosterStat){return entries.map((entry,index)=>({entry,index})).filter(({entry})=>position==='All'||(entry.player.position||'').split('-').some(p=>p===position||(position==='G'&&['PG','SG'].includes(p))||(position==='F'&&['SF','PF'].includes(p)))).sort((a,b)=>{if(sort==='name')return a.entry.player.name.localeCompare(b.entry.player.name)||a.index-b.index;if(sort==='stat'){const x=a.entry.stats[stat],y=b.entry.stats[stat];return x===undefined?(y===undefined?a.index-b.index:1):y===undefined?-1:y-x||a.index-b.index;}return a.index-b.index}).map(v=>v.entry);}
