import {Suspense} from 'react';
import Explorer from '@/components/explore/explorer';
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;return <Suspense fallback={<p>Loading player…</p>}><Explorer kind="player" id={id}/></Suspense>}
