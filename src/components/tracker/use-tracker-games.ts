'use client';
import {useEffect,useState,useCallback} from 'react';
import {trackerGameSchema,type TrackerGame} from '@/domain/tracker';
export type GameResource={data?:TrackerGame;error?:string};
/** One subscription per unique game for the entire tracker, including its editor. */
export function useTrackerGames(ids:string[]){
 const key=[...new Set(ids)].sort().join(','),[resources,setResources]=useState<Record<string,GameResource>>({}),[revision,setRevision]=useState(0);
 const refresh=useCallback(()=>setRevision(n=>n+1),[]);
 useEffect(()=>{const controller=new AbortController();let running=false;
  async function update(){if(document.hidden||running)return;running=true;try{await Promise.all(key.split(',').filter(Boolean).map(async id=>{try{const r=await fetch('/api/tracker?game='+id,{cache:'no-store',signal:AbortSignal.any([controller.signal,AbortSignal.timeout(30000)])});if(!r.ok)throw new Error('Statistics unavailable.');const data=trackerGameSchema.parse(await r.json());if(data.game.id!==id)throw new Error('Game identity mismatch.');if(!controller.signal.aborted)setResources(old=>({...old,[id]:{data}}));}catch{if(!controller.signal.aborted)setResources(old=>({...old,[id]:{error:'Statistics unavailable.'}}));}}));}finally{running=false;}}
  void update();const interval=setInterval(()=>void update(),60000);const visible=()=>{if(!document.hidden)void update();};document.addEventListener('visibilitychange',visible);
  return()=>{controller.abort();clearInterval(interval);document.removeEventListener('visibilitychange',visible);};
 },[key,revision]);
 return {resources,refresh};
}
