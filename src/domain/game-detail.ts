import {z} from 'zod';
import {playerSchema} from './player';
export const gameBoxSnapshotSchema=z.object({season:z.number().nullable(),phase:z.number().nullable(),rows:z.array(z.object({player:playerSchema,teamId:z.string(),starter:z.boolean(),didNotPlay:z.boolean(),stats:z.array(z.object({key:z.string(),label:z.string(),value:z.string()}))}))});
export type GameBoxSnapshot=z.infer<typeof gameBoxSnapshotSchema>;
export const playerSeasonSchema=z.object({gameId:z.string(),playerId:z.string(),season:z.number(),phase:z.number(),games:z.number(),averages:z.record(z.string(),z.number()),fetchedAt:z.string(),stale:z.boolean()});
export type PlayerSeason=z.infer<typeof playerSeasonSchema>;
