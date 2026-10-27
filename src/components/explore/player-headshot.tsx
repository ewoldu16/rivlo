'use client';
import Image from 'next/image';
import {useState} from 'react';
import {UserRound,Expand} from 'lucide-react';
import type {Player} from '@/domain/ecosystem';
import {useExperience} from '../experience/provider';
import {reducedMotion} from '../experience/motion';
export function PlayerHeadshot({player,large=false,team,onSelect}:{player:Player;large?:boolean;team?:string;onSelect?:(trigger:HTMLButtonElement)=>void}){
 const [failed,setFailed]=useState<string|null>(null),experience=useExperience();
 const expected=`https://a.espncdn.com/i/headshots/nba/players/full/${player.id}.png`;
 const source=process.env.NEXT_PUBLIC_PLAYER_IMAGE_MODE==='silhouette'?undefined:player.headshot===expected?expected:undefined;
 if((!source||failed===source)&&onSelect)return <button type="button" className={`player-headshot ${large?'large':''}`} data-detail-player={player.id} data-detail-focus={`portrait-${player.id}`} aria-label={`View ${player.name} player details`} aria-haspopup="dialog" onClick={e=>{e.preventDefault();e.stopPropagation();onSelect(e.currentTarget)}}><UserRound size={large?48:26} aria-label={`${player.name} photo unavailable`}/></button>;
 if(!source||failed===source)return <span className={`player-headshot ${large?'large':''}`}><UserRound size={large?48:26} aria-label={`${player.name} photo unavailable`}/></span>;
 return <button type="button" className={`player-headshot photo-trigger ${large?'large':''}`} data-detail-player={onSelect?player.id:undefined} data-detail-focus={onSelect?`portrait-${player.id}`:undefined} aria-label={onSelect?`View ${player.name} player details`:`Enlarge ${player.name} photo`} aria-haspopup="dialog" onClick={e=>{e.preventDefault();e.stopPropagation();if(onSelect){onSelect(e.currentTarget);return;}const trigger=e.currentTarget;experience.photo({id:player.id,name:player.name,source,preview:trigger.querySelector('img')?.currentSrc||source,team:team||'Team unavailable on this surface',origin:trigger.getBoundingClientRect(),trigger,reduced:reducedMotion(trigger),accent:getComputedStyle(trigger).getPropertyValue('--accent')});}}><Image src={source} sizes={large?'104px':'52px'} width={large?104:52} height={large?104:52} alt={player.name} loading="lazy" onError={()=>setFailed(source)}/><Expand className="photo-expand" size={12} aria-hidden="true"/></button>;
}
