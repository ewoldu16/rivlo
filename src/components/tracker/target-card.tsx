'use client';
import {teamSurfaceStyle} from '../ui/team-surface';
import {useEffect,useRef} from 'react';
import Link from 'next/link';
import {motion,useReducedMotion} from 'motion/react';
import {Pencil,Trash2,Archive} from 'lucide-react';
import {PlayerHeadshot} from '../explore/player-headshot';
import {ExploreTeamMark} from '../explore/shared';
import {useExperience} from '../experience/provider';
import {motionTiming} from '../experience/motion';
import {targetProgress,type Target} from '@/domain/tracker';
import {statusLabel} from '@/domain/nba';
import {seasonForGame} from '@/domain/ecosystem';
import type {GameResource} from './use-tracker-games';
export function TargetCard({target:t,resource,collection,onEdit,onArchive,onDelete,reduced=false}:{target:Target;resource?:GameResource;collection?:string;onEdit:()=>void;onArchive:()=>void;onDelete:()=>void;reduced?:boolean}){
 const p=targetProgress(t,resource?.data,resource?.error),previous=useRef(p.status),experience=useExperience(),systemReduced=useReducedMotion();
 useEffect(()=>{if(previous.current==='Live'&&p.status==='Reached')experience.notify({message:`${t.player.name} reached ${t.threshold} ${t.category}. Subject to corrections.`});previous.current=p.status;},[p.status,t.player.name,t.threshold,t.category,experience]);
 const duration=reduced||systemReduced?0:motionTiming.tabs;
 return <motion.article layout="position" initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:.98}} transition={{duration}} className="tracker-card rv-surface" style={teamSurfaceStyle(t.team,t.opponent)} data-state={p.status}>
  <div className="tracker-card-player"><PlayerHeadshot player={t.player} team={`${t.team.city} ${t.team.name}`}/><div><Link href={`/players/${t.player.id}?season=${resource?.data?.box.season||seasonForGame(t.start)}&phase=${resource?.data?.box.phase||2}`}>{t.player.name}</Link><small><ExploreTeamMark team={t.team}/>{t.team.short} vs {t.opponent.short} · {new Date(t.start).toLocaleDateString('en-GB',{timeZone:'Europe/London',day:'numeric',month:'short'})}</small></div><span className={`tracker-state ${p.status==='Reached'?'reached':''}`}>{t.archived?'Archived':p.status}</span></div>
  <div className="tracker-card-value"><span>{t.operator==='at-least'?'At least':'At most'} <strong>{t.threshold} {t.category}</strong></span><strong key={p.value} className="ui-stat-change">{p.value??'—'}<small> verified</small></strong></div>
  <div className="tracker-progress" role={p.progress===null?undefined:"progressbar"} aria-hidden={p.progress===null?true:undefined} aria-label={`${t.player.name} ${t.category} relative to target`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={p.progress===null?undefined:Math.round(p.progress)} aria-valuetext={`${p.value} ${t.category}; target ${t.operator==='at-least'?'at least':'at most'} ${t.threshold}`}><span style={{transform:`scaleX(${(p.progress??0)/100})`}}/></div>
  <p className="tracker-note">{t.archived?'Restore to resume feed updates.':p.detail}</p>
  <p className="tracker-timestamp">{resource?.data?<>{statusLabel(resource.data.game)} · Source checked {new Date(resource.data.fetchedAt).toLocaleTimeString('en-GB',{timeZone:'Europe/London',hour:'2-digit',minute:'2-digit'})}</>:t.archived?"Updates paused":"Source check pending"}</p>
  <details className="tracker-target-details"><summary>Target details</summary><div className="ui-content-panel"><p>Player ID {t.player.id} · {t.category} · {t.operator==='at-least'?'≥':'≤'} {t.threshold}</p><p>{['PR','PA','RA','PRA'].includes(t.category)?'Combined values require all component statistics.':'Only published game statistics are used.'} At most settles only after final. Official corrections can change results.</p>{resource?.data?.warnings.map(w=><p key={w}>{w}</p>)}</div></details>
  <div className="tracker-card-footer"><span>{collection||'No collection'}</span><button onClick={onEdit} aria-label={`Edit ${t.player.name} target`}><Pencil size={16}/></button><button onClick={onArchive} aria-label={`${t.archived?'Restore':'Archive'} ${t.player.name} target`}><Archive size={16}/></button><button onClick={onDelete} aria-label={`Delete ${t.player.name} target`}><Trash2 size={16}/></button><Link href={'/games/'+t.gameId}>Game →</Link></div>
 </motion.article>;
}
