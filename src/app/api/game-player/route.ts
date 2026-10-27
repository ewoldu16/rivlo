import {NextRequest,NextResponse} from 'next/server';
import {getSummary} from '@/data/espn/server';
import {readEcosystemResource} from '@/data/espn/ecosystem-server';
import {mapPlayByPlay} from '@/data/espn/play-by-play-mapping';
import {mapPlayerLogs} from '@/data/espn/ecosystem-mapping';
import {rosterAverages} from '@/domain/roster';
export const runtime='nodejs';
export async function GET(request:NextRequest){const q=request.nextUrl.searchParams,game=q.get('game')||'',player=q.get('player')||'';if(!/^espn-\d{1,15}$/.test(game)||!/^\d{1,12}$/.test(player))return NextResponse.json({error:'Invalid game or player.'},{status:400});try{const s=await getSummary(game.slice(5)),feed=mapPlayByPlay(s.value.raw,game,s.value.fetchedAt),box=feed.boxScore,season=box?.season,phase=box?.phase;if(!season||!phase||!box?.rows.some(r=>r.player.id===player))return NextResponse.json({error:'Season or game player could not be verified.'},{status:404});const r=await readEcosystemResource(`https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${player}/gamelog?season=${season}`),logs=mapPlayerLogs(r.value.raw,player,season,phase);return NextResponse.json({gameId:game,playerId:player,season,phase,games:logs.length,averages:rosterAverages(logs),fetchedAt:r.value.at,stale:r.stale||s.stale},{headers:{'Cache-Control':'no-store'}});}catch{return NextResponse.json({error:'Season averages unavailable.'},{status:502});}}
