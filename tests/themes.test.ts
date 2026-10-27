import {describe,it,expect} from 'vitest';
import {accentChoices,accentIds} from '../src/domain/themes';
import {parsePreferences,defaults} from '../src/domain/nba';
describe('onboarding accent compatibility',()=>{
 it('round-trips all functional accents without losing existing favourites or motion',()=>{expect(new Set(accentChoices.map(a=>a.id)).size).toBe(accentIds.length);for(const accent of accentIds){const saved={...defaults,accent,favourites:['uptown'],motion:'reduced' as const};expect(parsePreferences(JSON.stringify(saved))).toEqual(saved);}});
 it('keeps existing turquoise and ice preferences compatible and rejects unknown colours',()=>{for(const accent of ['mint','ice'])expect(parsePreferences(JSON.stringify({...defaults,accent})).accent).toBe(accent);expect(parsePreferences(JSON.stringify({...defaults,accent:'unknown'}))).toEqual(defaults);});
});
