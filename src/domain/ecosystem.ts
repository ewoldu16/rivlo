import {z} from 'zod';
import {normalizedTeamSchema} from './nba';
export {playerSchema,type Player} from './player';
export const statSchema=z.object({key:z.string(),label:z.string(),value:z.string()});
export type Stat=z.infer<typeof statSchema>;
export const standingSchema=z.object({team:normalizedTeamSchema,conference:z.string(),wins:z.number().nullable(),losses:z.number().nullable(),pct:z.string(),behind:z.string(),rank:z.number().nullable(),form:z.string()});
export type Standing=z.infer<typeof standingSchema>;
export const playerLogSchema=z.object({playerId:z.string(),gameId:z.string(),team:normalizedTeamSchema.nullable(),opponent:normalizedTeamSchema.nullable(),date:z.string(),season:z.number(),phase:z.string(),stats:z.array(statSchema)});
export type PlayerLog=z.infer<typeof playerLogSchema>;
export function seasonLabel(year:number){return `${year-1}–${String(year).slice(-2)}`;}
export function teamPath(id:string,season=2027,phase?:number){return `/teams/${id.replace(/^espn-team-/,'')}?season=${season}${phase?'&phase='+phase:''}`;}
export function seasonForGame(start:string){const year=Number(start.slice(0,4));return year+(Number(start.slice(5,7))>=9?1:0);}
export function realTeam(id:string){return /^espn-team-\d+$/.test(id);}
