import {Suspense} from 'react';
import Explorer from '@/components/explore/explorer';
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;return <Suspense fallback={<p>Loading team…</p>}><Explorer kind="team" id={id}/></Suspense>}
