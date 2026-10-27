import {NextRequest,NextResponse} from 'next/server';
import {getPregameComparison} from '@/data/espn/pregame-server';
export const runtime='nodejs';
export async function GET(request:NextRequest){const id=request.nextUrl.searchParams.get('game');if(!id||!/^espn-\d{1,15}$/.test(id))return NextResponse.json({error:'Choose a valid NBA game.'},{status:400});try{return NextResponse.json(await getPregameComparison(id.slice(5)),{headers:{'Cache-Control':'no-store'}})}catch{return NextResponse.json({error:'Pregame information is unavailable. Your game preview is still available.'},{status:502,headers:{'Cache-Control':'no-store'}})}}
