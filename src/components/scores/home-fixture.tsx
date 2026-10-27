'use client';
import Link from 'next/link';
import {Radio} from 'lucide-react';
import type {CSSProperties,ReactNode} from 'react';
import {displayScore,statusLabel,type Game,type Team} from '@/domain/nba';
import {realTeam,seasonForGame,teamPath} from '@/domain/ecosystem';
export function HomeFixture({game,home,away,homeFollow,awayFollow,mark,zone}:{game:Game;home:Team;away:Team;homeFollow:ReactNode;awayFollow:ReactNode;mark:(t:Team)=>ReactNode;zone:string}){
 const live=game.status==='in-progress',upcoming=game.status==='upcoming',final=game.status==='completed';
 const state=live?(game.mode==='demo'?`Q${game.quarter} \u00b7 ${game.clock.replace(/^0(?=\d:)/,'')}`:statusLabel(game)):final?'Final':upcoming?'Upcoming':game.statusText||game.status;
 const timeText=new Intl.DateTimeFormat('en-GB',{timeZone:zone,hour:'2-digit',minute:'2-digit'}).format(new Date(game.start));
 const localDay=new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(game.start));
 const time=(game.scheduleDate&&localDay!==game.scheduleDate?new Intl.DateTimeFormat('en-GB',{timeZone:zone,day:'numeric',month:'short'}).format(new Date(game.start))+' / ':'')+timeText;
 const summary=upcoming?`${home.city} ${home.name} versus ${away.city} ${away.name}, scheduled ${time}`:`${home.city} ${home.name} ${displayScore(game,'home')??'score unavailable'} versus ${away.city} ${away.name} ${displayScore(game,'away')??'score unavailable'}, ${state}`;
 const matchupTeams=[home,away],homeScore=displayScore(game,'home'),awayScore=displayScore(game,'away');
 const teamColour=(value:string)=>/^#[0-9a-f]{6}$/i.test(value)?value:'var(--rv-primitive-slate)';
 return <article className={`fixture scorecard home-fixture fixture-${game.status}`} style={{'--scores-home-team-color':teamColour(home.color),'--scores-away-team-color':teamColour(away.color)} as CSSProperties}>
 <Link className="fixture-link home-match-link" href={'/games/'+game.id} aria-label={`Open game centre: ${summary}`}><span className="sr-only">{summary}</span></Link>
 <div className="home-fixture-teams">{matchupTeams.map((t,i)=>{const score=upcoming?'\u2014':displayScore(game,i===0?'home':'away')??'\u2014',losing=final&&homeScore!==null&&awayScore!==null&&(i===0?homeScore<awayScore:awayScore<homeScore);const identity=<>{mark(t)}{' '}<span className="home-team-label"><strong>{t.name}</strong><small>{t.city}</small></span></>;return <div className={`home-team-line ${i===0?'home-side':'away-side'} ${losing?'is-trailing':''}`} key={t.id}>{realTeam(t.id)?<Link className="home-team-link" href={teamPath(t.id,seasonForGame(game.start))} title={`Explore ${t.city} ${t.name}`}>{identity}<span className="sr-only"> Explore {t.city} {t.name}</span></Link>:<span className="home-team-link">{identity}</span>}{!upcoming&&<span className="score" key={score}>{score}</span>}<span className="home-follow">{i===0?homeFollow:awayFollow}</span></div>})}</div>
 <div className="home-match-meta"><small className={live?'live-label':undefined}>{live?'LIVE':'NBA'}</small><span className={live?'is-live':''}>{live&&<Radio size={10}/>} {state}</span><time dateTime={game.start}>{time}</time></div>
 </article>;
}
