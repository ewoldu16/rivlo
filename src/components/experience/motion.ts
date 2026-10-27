/** Seconds for Motion/WAAPI; CSS tokens are installed from these same values. */
export const motionTiming={press:.1,hover:.15,tabs:.18,menu:.2,dialog:.24,page:.2};
export const motionEase='cubic-bezier(0.2,0.8,0.2,1)';
export function reducedMotion(element?:Element|null){let stored=false;try{const prefs=JSON.parse(localStorage.getItem('project01.preferences.v1')||'null');stored=prefs?.version===1&&prefs.motion==='reduced';}catch{}return stored||matchMedia('(prefers-reduced-motion: reduce)').matches||!!element?.closest('.reduce-motion')||document.querySelector('.app')?.classList.contains('reduce-motion')===true;}
