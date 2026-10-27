import {z} from 'zod';
export const playerSchema=z.object({id:z.string().regex(/^\d+$/),name:z.string(),jersey:z.string().optional(),position:z.string().optional(),height:z.string().optional(),age:z.number().optional(),headshot:z.string().optional(),status:z.string().optional()});
export type Player=z.infer<typeof playerSchema>;
