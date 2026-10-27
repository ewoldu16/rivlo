import {describe,it,expect} from 'vitest';
import {fixtures,total,sampleUpdate,selectGames,parsePreferences,defaults,localDate,statusLabel} from '../src/domain/nba';
describe('NBA demo domain',()=>{
 it('seeds 24 stable coherent games across three days',()=>{expect(fixtures).toHaveLength(24);expect(new Set(fixtures.map(g=>g.id)).size).toBe(24);expect(selectGames(fixtures,{date:'2026-10-17'})).toHaveLength(8)});
 it('combines filters, search and follows',()=>{expect(selectGames(fixtures,{date:'2026-10-17',status:'in-progress',search:'Uptown',favourites:['uptown']})).toHaveLength(1);expect(selectGames(fixtures,{date:'2026-10-18',status:'completed'})).toHaveLength(0)});
 it('updates scores and periods atomically, without mutating or double-applying',()=>{const g=fixtures.find(g=>g.id==='game-1-0')!;expect(total(g.homePeriods)).toBe(103);const next=sampleUpdate(g);expect(total(next.homePeriods)).toBe(105);expect(next.homePeriods[3]).toBe(28);expect(sampleUpdate(next)).toEqual(next);expect(total(g.homePeriods)).toBe(103)});
 it('recovers from malformed, old or unknown stored preferences',()=>{for(const input of ['{','null','{}',JSON.stringify({...defaults,favourites:['missing']})])expect(parsePreferences(input)).toEqual(defaults);expect(parsePreferences(JSON.stringify({...defaults,favourites:['uptown'],accent:'ice'})).favourites).toEqual(['uptown'])});
 it('groups UTC starts in local calendar dates near midnight',()=>{expect(localDate('2026-10-17T23:30:00Z')).toBe('2026-10-18');expect(localDate('2026-10-17T23:30:00Z','America/New_York')).toBe('2026-10-17')});
 it('labels simulated state and final state',()=>{expect(statusLabel(fixtures[8])).toBe('Demo · Q4 02:14');expect(statusLabel(fixtures[0])).toBe('Final')});
});
