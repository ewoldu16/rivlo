import type {CSSProperties} from 'react';

type TeamColour = {color?:string} | null | undefined;
const colour=(team:TeamColour)=>team?.color&&/^#[0-9a-f]{6}$/i.test(team.color)?team.color:'var(--rv-primitive-slate)';
/** Bind colours only; shared surface tokens control intensity and blending. */
export function teamSurfaceStyle(left:TeamColour,right:TeamColour=left):CSSProperties {
 return {'--scores-home-team-color':colour(left),'--scores-away-team-color':colour(right)} as CSSProperties;
}
