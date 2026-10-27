import {Suspense} from 'react';
import Explorer from '@/components/explore/explorer';
export default function Page(){return <Suspense fallback={<p>Loading standings…</p>}><Explorer kind="standings"/></Suspense>}
