'use client';
import {teamSurfaceStyle} from '../ui/team-surface';
import {createContext,useContext,useState,useRef,useEffect,useCallback,type ReactNode} from 'react';
import {ArrowLeft,X} from 'lucide-react';
import type {Game,Team} from '@/domain/nba';
import {seasonForGame} from '@/domain/ecosystem';
import type {PlayByPlay} from '@/domain/play-by-play';
import type {BoxData} from '@/domain/explore-contracts';
import {loadDetailBox} from './game-detail-data';
import {reducedMotion} from '../experience/motion';
import {trapDialogFocus} from '../experience/dialog';
import {PlayerDetail,PlayDetail} from './game-detail-views';
type Selection={kind:'player'|'play';id:string;trigger:HTMLElement|null;scrollTop:number};
type Details={stale:boolean;game:Game;feed?:PlayByPlay;home:Team;away:Team;box?:BoxData;boxError:string;ensureBox:(force?:boolean)=>void;openPlayer:(id:string,trigger?:HTMLElement|null)=>void;openPlay:(id:string,trigger?:HTMLElement|null)=>void};
const Context=createContext<Details|null>(null);
export const useGameDetails=()=>useContext(Context);
export function GameDetailsProvider({stale=false,game,feed,home,away,children}:{stale?:boolean;game:Game;feed?:PlayByPlay;home:Team;away:Team;children:ReactNode}){
 const [stack,setStack]=useState<Selection[]>([]),[fallback,setFallback]=useState<BoxData>(),[boxError,setBoxError]=useState('');
 const dialog=useRef<HTMLDialogElement>(null),rootTrigger=useRef<HTMLElement|null>(null),pendingBox=useRef(false),closing=useRef(false),restoration=useRef<string|null>(null);
 const snapshot=feed?.gameId===game.id?feed.boxScore:undefined;
 const box:BoxData|undefined=snapshot?{season:snapshot.season,phase:snapshot.phase,groups:[away,home].map(team=>({team,rows:snapshot.rows.filter(r=>r.teamId===team.id).map(({player,starter,didNotPlay,stats})=>({player,starter,didNotPlay,stats}))})).filter(g=>g.rows.length)}:fallback;
 const ensureBox=useCallback((force=false)=>{if(snapshot||pendingBox.current||!force&&fallback)return;pendingBox.current=true;setBoxError('');void loadDetailBox(game.id,seasonForGame(game.start),force).then(data=>{if(data.groups.some(g=>g.team.id!==game.home&&g.team.id!==game.away))throw Error('Box-score team mismatch.');setFallback(data)}).catch(()=>setBoxError('Box score unavailable.')).finally(()=>{pendingBox.current=false})},[snapshot,fallback,game.id,game.start,game.home,game.away]);
 function open(kind:Selection['kind'],id:string,trigger:HTMLElement|null=null){if(!/^\d+$/.test(id))return;if(!stack.length)rootTrigger.current=trigger||document.activeElement as HTMLElement;setStack(s=>[...(s.length?[...s.slice(0,-1),{...s[s.length-1],scrollTop:dialog.current?.scrollTop||0}]:[]),{kind,id,trigger,scrollTop:0}]);if(kind==='player')ensureBox();}
 const active=stack.at(-1),isOpen=!!active;
 useEffect(()=>{if(!isOpen||!dialog.current)return;const d=dialog.current,overflow=document.body.style.overflow,padding=document.body.style.paddingRight,scrollbar=innerWidth-document.documentElement.clientWidth;if(scrollbar>0)document.body.style.paddingRight=(parseFloat(getComputedStyle(document.body).paddingRight)+scrollbar)+'px';document.body.style.overflow='hidden';closing.current=false;d.showModal();return()=>{d.close();document.body.style.overflow=overflow;document.body.style.paddingRight=padding;const trigger=rootTrigger.current;if(trigger?.isConnected)trigger.focus({preventScroll:true});else document.getElementById('game-tab-panel')?.focus({preventScroll:true});};},[isOpen]);
 useEffect(()=>{if(!active)return;const d=dialog.current;if(!d)return;const frame=requestAnimationFrame(()=>{d.scrollTop=active.scrollTop;const key=restoration.current;restoration.current=null;const target=key?d.querySelector<HTMLElement>(`[data-detail-focus="${key}"]`):null;(target||d.querySelector<HTMLElement>('[data-detail-back]'))?.focus({preventScroll:true});});return()=>cancelAnimationFrame(frame)},[active,stack.length]);
 function close(){if(closing.current)return;const d=dialog.current;if(!d||reducedMotion(d)){setStack([]);return;}closing.current=true;const animation=d.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(12px)'}],{duration:140,easing:'ease-in',fill:'forwards'});const finish=()=>{animation.cancel();setStack([]);closing.current=false;};animation.finished.then(finish,finish);}
 function back(){if(stack.length>1){restoration.current=active?.trigger?.dataset.detailFocus||null;setStack(s=>s.slice(0,-1))}else close();}
 const value:Details={stale,game,feed,home,away,box,boxError,ensureBox,openPlayer:(id,trigger)=>open('player',id,trigger),openPlay:(id,trigger)=>open('play',id,trigger)};
 return <Context.Provider value={value}>{children}<dialog ref={dialog} className="game-detail-dialog" style={teamSurfaceStyle(away,home)} aria-labelledby="game-detail-title" onKeyDown={trapDialogFocus} onCancel={e=>{e.preventDefault();back()}} onClick={e=>{if(e.target===dialog.current)back()}}><div className="game-detail-shell"><header className="game-detail-toolbar"><button data-detail-back onClick={back} aria-label={stack.length>1?'Back to previous detail':'Close game detail'}><ArrowLeft size={20}/><span>{stack.length>1?'Back':'Game'}</span></button><span>{active?.kind==='player'?'PLAYER DETAIL':'PLAY DETAIL'}</span><button onClick={back} aria-label={active?.kind==='player'?'Close player details':'Close play details'}><X size={20}/></button></header>{active?.kind==='player'?<PlayerDetail key={active.id} playerId={active.id}/>:active?<PlayDetail eventId={active.id} onNavigate={id=>setStack(s=>[...s.slice(0,-1),{...s[s.length-1],id,scrollTop:0}])}/>:null}</div></dialog></Context.Provider>;
}
