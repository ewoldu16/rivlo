'use client';
import {useEffect,useState,type ReactNode,type RefObject} from 'react';
import Link from 'next/link';
import {ArrowLeft,Search} from 'lucide-react';
import {fixtures,snapshotSchema,localDate,type Game,type Team} from '@/domain/nba';
import type {PlayByPlay} from '@/domain/play-by-play';
import {GameCentre} from './game-centre';
import {GameFixtureNavigation,useGameTimezone} from './game-navigation';
import {LoadingSkeleton} from '../experience/primitives';

export function GameExperience({stale=false,game,playByPlay,gameId,team,loading,error,retry,follow,onSearch,searchRef,onRefresh,refreshing}:{stale?:boolean;game?:Game;playByPlay?:PlayByPlay;gameId:string;team:(id:string)=>Team;loading:boolean;error?:string;retry:()=>void;follow:(id:string)=>ReactNode;onSearch:()=>void;searchRef:RefObject<HTMLButtonElement|null>;onRefresh:()=>void;refreshing:boolean}){
 const zone=useGameTimezone(),[schedule,setSchedule]=useState<{date:string;games:Game[];error?:string}>({date:'',games:[]}),[attempt,setAttempt]=useState(0);
 const mode=game?.mode;
 const date=game?(game.scheduleDate||localDate(game.start,game.mode==='espn'?'America/New_York':'Europe/London')):undefined;
 useEffect(()=>{if(!date||mode!=='espn')return;const controller=new AbortController();void(async()=>{try{const response=await fetch('/api/nba?date='+date,{signal:AbortSignal.any([controller.signal,AbortSignal.timeout(22000)])});if(!response.ok)throw Error('Schedule unavailable');const parsed=snapshotSchema.parse(await response.json());if(!controller.signal.aborted)setSchedule({date,games:parsed.games.filter(g=>(g.scheduleDate||localDate(g.start,'America/New_York'))===date)});}catch{if(!controller.signal.aborted)setSchedule({date,games:[],error:'Schedule unavailable'})}})();return()=>controller.abort()},[date,mode,attempt]);
 const matching=game?.mode==='demo'?fixtures.filter(g=>localDate(g.start)===date):schedule.date===date?schedule.games:[];
 const games=game?(matching.some(g=>g.id===game.id)?matching.map(g=>g.id===game.id?game:g):[game,...matching]):schedule.games;
 return <div className="game-experience"><div className="game-context-toolbar"><Link className="game-back" aria-label="All scores" href={`/?date=${date||''}${gameId.startsWith('espn-')?'&mode=espn':''}`}><ArrowLeft size={20}/><span>Scores</span></Link><span>NBA · Game centre</span><button ref={searchRef} onClick={onSearch} aria-label="Search teams and games"><Search size={20}/></button></div><GameFixtureNavigation games={games} selected={gameId} team={team} zone={zone} date={date||schedule.date||undefined} loading={loading||!!game&&game.mode==='espn'&&schedule.date!==date} error={schedule.date===date?schedule.error:undefined} retry={()=>setAttempt(n=>n+1)}/>{loading?<div className="game-chrome-loading" aria-label="Loading game preview"><LoadingSkeleton label="Loading game preview…" rows={3}/></div>:error?<div className="empty"><h1>Game preview unavailable.</h1><p>{error}</p><button className="secondary" onClick={retry}>Try again</button><Link href="/?mode=espn">Back to schedule</Link></div>:game?<><GameCentre stale={stale} key={game.id} game={game} playByPlay={playByPlay} home={team(game.home)} away={team(game.away)} follow={follow}/>{game.mode==='espn'&&<button className="game-refresh" disabled={refreshing} onClick={onRefresh}>{refreshing?'Updating game…':'Refresh game snapshot'}</button>}</>:<div className="empty"><h1>Game not found.</h1><p>This fixture is not available in the selected source.</p><Link href="/">Back to scores</Link></div>}</div>
}
