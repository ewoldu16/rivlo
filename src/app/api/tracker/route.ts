import {NextRequest,NextResponse} from 'next/server';
import {getEspnGame} from '@/data/espn/server';
import {explore,trackerRoster} from '@/data/espn/ecosystem-server';
import {boxDataSchema} from '@/domain/explore-contracts';
import {trackerGameSchema} from '@/domain/tracker';
import {seasonForGame} from '@/domain/ecosystem';
export const runtime='nodejs';
export async function GET(request:NextRequest){
 const id=request.nextUrl.searchParams.get('game');if(!id||!/^espn-\d{1,15}$/.test(id))return NextResponse.json({error:'Invalid NBA game ID.'},{status:400});
 try{
  const [snapshot,envelope]=await Promise.all([getEspnGame(id.slice(5)),explore('box',id.slice(5),2027,2)]);
  const game=snapshot.games[0],box=boxDataSchema.parse(envelope.data),warnings=[...snapshot.warnings,...envelope.warnings];let stale=snapshot.stale||envelope.stale;
  if(box.groups.some(g=>g.team.id!==game.home&&g.team.id!==game.away))throw new Error('Participant team mismatch.');
  const participants=box.groups.flatMap(g=>g.rows.map(r=>({player:r.player,team:g.team,provisional:false})));
  if(game.status==='upcoming'&&!participants.length){
   const rosters=await Promise.allSettled([game.homeTeam!,game.awayTeam!].map(async team=>{const roster=await trackerRoster(team.id.replace('espn-team-',''),box.season||seasonForGame(game.start));stale||=roster.stale;return roster.players.map(player=>({player,team,provisional:true}));}));
   rosters.forEach(r=>{if(r.status==='fulfilled')participants.push(...r.value);else warnings.push('One team roster is unavailable.');});
  }
  const data=trackerGameSchema.parse({game,box,participants,fetchedAt:[snapshot.fetchedAt,envelope.fetchedAt].sort()[0],stale,warnings});
  return NextResponse.json(data,{headers:{'Cache-Control':'no-store'}});
 }catch{return NextResponse.json({error:'Game statistics are unavailable. Try again.'},{status:502});}
}
