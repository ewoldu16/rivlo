import {Suspense} from 'react';
import Explorer from '@/components/explore/explorer';
export default function Page(){return <Suspense fallback={<p>Loading NBA teams…</p>}><Explorer kind="directory"/></Suspense>}
