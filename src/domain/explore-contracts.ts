import {z} from 'zod';
import {normalizedTeamSchema,gameSchema} from './nba';
import {playerSchema,standingSchema,statSchema,playerLogSchema} from './ecosystem';
export const teamDataSchema=z.object({team:normalizedTeamSchema,division:z.string().nullable(),divisionRank:z.number().nullable().default(null),standing:standingSchema.nullable(),context:z.array(standingSchema),roster:z.array(playerSchema),rosterPhase:z.string().nullable(),rosterVerified:z.boolean(),schedule:z.array(gameSchema),statistics:z.array(statSchema),leaders:z.array(z.object({player:playerSchema,teamId:z.string(),season:z.number(),phase:z.number(),label:z.string(),value:z.string()}))});
export const playerDataSchema=z.object({player:playerSchema,team:normalizedTeamSchema.nullable(),associationVerified:z.boolean(),logs:z.array(playerLogSchema),averages:z.array(statSchema),career:z.object({experience:z.string(),draft:z.string(),birthplace:z.string()})});
export const boxDataSchema=z.object({season:z.number().nullable(),phase:z.number().nullable(),groups:z.array(z.object({team:normalizedTeamSchema,rows:z.array(z.object({player:playerSchema,starter:z.boolean(),didNotPlay:z.boolean(),stats:z.array(statSchema)}))}))});
export const exploreEnvelope=z.object({data:z.unknown(),season:z.number(),phase:z.number(),stale:z.boolean(),fetchedAt:z.string(),warnings:z.array(z.string())});
export type TeamData=z.infer<typeof teamDataSchema>;export type PlayerData=z.infer<typeof playerDataSchema>;export type BoxData=z.infer<typeof boxDataSchema>;
