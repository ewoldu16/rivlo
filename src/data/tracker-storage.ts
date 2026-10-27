import {parseTracker,trackerSchema,type TrackerStore} from '../domain/tracker';
export interface TrackerRepository {load():TrackerStore;save(value:TrackerStore):void}
export const trackerStorageKey='project01.tracker.v1';
export const trackerChanged='rivlo:tracker-changed';
export function subscribeTracker(listener:()=>void){const storage=(event:StorageEvent)=>{if(event.key===trackerStorageKey||event.key===null)listener()};window.addEventListener('storage',storage);window.addEventListener(trackerChanged,listener);return()=>{window.removeEventListener('storage',storage);window.removeEventListener(trackerChanged,listener)}}
export const localTrackerRepository:TrackerRepository={load:()=>parseTracker(localStorage.getItem(trackerStorageKey)),save:value=>{const checked=trackerSchema.parse(value);localStorage.setItem(trackerStorageKey,JSON.stringify(checked));window.dispatchEvent(new Event(trackerChanged));}};

