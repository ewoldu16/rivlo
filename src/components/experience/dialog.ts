import type {KeyboardEvent} from 'react';
/** Native modality makes the page inert; explicitly wrap Tab for browser consistency. */
export function trapDialogFocus(event:KeyboardEvent<HTMLDialogElement>){
 if(event.key!=='Tab')return;
 const controls=Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"])')).filter(e=>e.getClientRects().length>0);
 const first=controls[0],last=controls.at(-1);if(!first)return;
 if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
 else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
}
