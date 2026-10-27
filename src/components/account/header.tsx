'use client';
import Link from 'next/link';
import {Search} from 'lucide-react';
import type {RefObject} from 'react';
export function AccountHeader({title,mode,onSearch,searchRef}:{title:string;mode:'demo'|'espn';onSearch:()=>void;searchRef:RefObject<HTMLButtonElement|null>}){const source=mode==='demo'?'Demo · simulated data':'ESPN preview · unofficial data';return <header className="account-header"><h1>{title}</h1><button ref={searchRef} aria-label="Search teams and games" onClick={onSearch}><Search size={19}/></button><Link className="account-source" href="/preferences" aria-label={`${source} — Data source preferences`}>{source}</Link></header>}
