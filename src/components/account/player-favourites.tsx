'use client';
import {useSyncExternalStore} from 'react';
import Link from 'next/link';
import {Star} from 'lucide-react';
import {playerSchema,type Player} from '@/domain/ecosystem';
import {useExperience} from '../experience/provider';
const KEY='project01.player-favourites.v1',EVENT='player-favourites-change';
const subscribe=(fn:()=>void)=>{addEventListener(EVENT,fn);addEventListener('storage',fn);return()=>{removeEventListener(EVENT,fn);removeEventListener('storage',fn)}};
function snapshot(){try{return localStorage.getItem(KEY)||'[]'}catch{return '[]'}}
function read(raw:string){try{return playerSchema.array().max(1000).parse(JSON.parse(raw))}catch{return []}}
export function useFavouritePlayers(){const raw=useSyncExternalStore(subscribe,snapshot,()=>'[]');return read(raw);}
export function PlayerFavourite({player}:{player:Player}){const players=useFavouritePlayers(),active=players.some(p=>p.id===player.id),experience=useExperience();return <button type="button" aria-label={`${active?'Unfavourite':'Favourite'} ${player.name}`} aria-pressed={active} onClick={()=>{try{const existing=playerSchema.array().max(1000).parse(JSON.parse(snapshot()));localStorage.setItem(KEY,JSON.stringify(active?existing.filter(p=>p.id!==player.id):[...existing.filter(p=>p.id!==player.id),player]));dispatchEvent(new Event(EVENT));experience.notify({message:active?'Player removed from favourites':'Player saved to favourites'});}catch{experience.notify({message:'Player favourites could not be saved on this device.'})}}}><Star size={18} fill={active?'currentColor':'none'}/></button>}
export function FavouritePlayers(){const players=useFavouritePlayers();return players.length?<section className="favourite-players" aria-label="Favourite players"><h2>Players</h2>{players.map(player=><div key={player.id}><Link href={`/players/${player.id}`}>{player.name}</Link><PlayerFavourite player={player}/></div>)}</section>:null;}
