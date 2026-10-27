import {NextRequest,NextResponse} from 'next/server';
import {getTeamRoster,currentRosterSeason} from '@/data/espn/roster-server';
export const runtime='nodejs';
export async function GET(request:NextRequest){const q=request.nextUrl.searchParams,id=q.get('team')||'',season=Number(q.get('season')||currentRosterSeason());if(!/^\d{1,3}$/.test(id)||!Number.isInteger(season)||season<2024||season>currentRosterSeason())return NextResponse.json({error:'Invalid team or season.'},{status:400});try{const r=await getTeamRoster(id,season);return NextResponse.json({...r.value,stale:r.stale||r.value.stale});}catch{return NextResponse.json({error:'Team roster could not be verified.'},{status:502});}}
