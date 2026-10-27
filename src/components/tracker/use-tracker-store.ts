 'use client';
import {useMemo,useSyncExternalStore} from 'react';
import {emptyTracker,parseTracker,type TrackerStore} from '@/domain/tracker';
import {localTrackerRepository,subscribeTracker,trackerStorageKey} from '@/data/tracker-storage';
const pending='__pending__',blocked='__blocked__';
const snapshot=()=>{try{return localStorage.getItem(trackerStorageKey)||''}catch{return blocked}};
export function useTrackerStore(){const raw=useSyncExternalStore(subscribeTracker,snapshot,()=>pending);return useMemo(()=>{try{return {store:raw===pending?emptyTracker():parseTracker(raw||null),ready:raw!==pending,error:''}}catch{return {store:emptyTracker(),ready:true,error:'Saved targets could not be read. Existing storage has not been changed.'}}},[raw]);}
export function updateTracker(update:(latest:TrackerStore)=>TrackerStore){const latest=localTrackerRepository.load();localTrackerRepository.save(update(latest));}
