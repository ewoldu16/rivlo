import {useGameDetails} from './game-details';
import {ArrowUpRight} from 'lucide-react';
import {displayScore,type Game,type Team} from '@/domain/nba';
import type {PlayByPlay} from '@/domain/play-by-play';
import {ExploreTeamMark} from '../explore/shared';

/** Context uses the same received game/feed snapshot; it does not fetch or poll. */
export function GameContext({game,data,home,away,onStats}:{game:Game;data?:PlayByPlay;home:Team;away:Team;onStats:()=>void}){
 const details=useGameDetails();
 const periods=Math.max(4,game.homePeriods.length,game.awayPeriods.length);
 const scoring=data?.gameId===game.id?data.events.filter(e=>/\bmakes\b/i.test(e.text)).slice(-3).reverse():[];
 return <aside className="game-context" aria-label="Game context">
 <section className="game-surface context-periods" aria-labelledby="context-scoring-title"><header className="game-surface-heading"><div><span className="game-eyebrow">The matchup</span><h2 id="context-scoring-title">Quarter scoring</h2></div><span className="context-status">{game.status==='in-progress'?'In progress':game.status==='completed'?'Final':'NBA'}</span></header><div className="context-table-scroll"><table><caption className="sr-only">Points by period, {away.name} at {home.name}</caption><thead><tr><th scope="col">Team</th>{Array.from({length:periods},(_,i)=><th scope="col" key={i}>{i<4?'Q'+(i+1):'OT'+(i-3)}</th>)}<th scope="col">T</th></tr></thead><tbody>{([away,home]).map((team,i)=><tr key={team.id}><th scope="row"><ExploreTeamMark team={team}/>{team.short}</th>{Array.from({length:periods},(_,p)=><td key={p}>{(i===0?game.awayPeriods:game.homePeriods)[p]??'—'}</td>)}<td>{displayScore(game,i===0?'away':'home')??'—'}</td></tr>)}</tbody></table></div><button className="context-stats-link" onClick={onStats}>Player box score <ArrowUpRight size={16} aria-hidden="true"/></button></section>
 {!!scoring.length&&<section className="game-surface" aria-labelledby="context-recent-title"><header className="game-surface-heading"><div><span className="game-eyebrow">Latest buckets</span><h2 id="context-recent-title">Recent scoring</h2></div></header><ol className="context-scoring-list">{scoring.map(e=><li key={e.id}><span className="context-play-clock">{e.period?e.period>4?'OT'+(e.period-4):'Q'+e.period:'—'}<small>{e.clock||'—'}</small></span><div>{e.players[0]?.name?<button className="context-player-trigger" onClick={event=>details?.openPlayer(e.players[0].id,event.currentTarget)}>{e.players[0].name}</button>:<strong>{e.type||'Scoring play'}</strong>}<p>{e.text}</p></div></li>)}</ol></section>}
 </aside>;
}
