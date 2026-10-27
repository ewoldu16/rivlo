import {describe,it,expect} from 'vitest';
import division from './fixtures/explore-division.json';
import roster from './fixtures/explore-roster.json';
import standings from './fixtures/explore-standings.json';
import schedule from './fixtures/explore-schedule.json';
import logs from './fixtures/explore-logs.json';
import {mapRoster,mapStandings,mapSchedule,mapPlayerLogs,averages,photo,mapTeamStatistics,mapDivision} from '../src/data/espn/ecosystem-mapping';
import {seasonForGame} from '../src/domain/ecosystem';
describe('season-safe NBA ecosystem mapping',()=>{
 it('keeps all 30 NBA identities and leaves a zero-game season unranked',()=>{const rows=mapStandings(standings,2027,2);expect(rows).toHaveLength(30);expect(new Set(rows.map(r=>r.team.id)).size).toBe(30);expect(rows.every(r=>r.rank===null&&r.wins===0&&r.losses===0)).toBe(true);expect(()=>mapStandings(standings,2026,2)).toThrow();expect(()=>mapStandings(standings,2027,1)).toThrow();});
 it('requires roster identity and year, retaining real stable player IDs',()=>{const data=mapRoster(roster,'13',2027);expect(data.players.find(p=>p.id==='3945274')?.name).toBe('Luka Doncic');expect(()=>mapRoster(roster,'2',2027)).toThrow();expect(()=>mapRoster(roster,'13',2026)).toThrow();});
 it('maps schedules to existing game identities and refuses season substitutions',()=>{const games=mapSchedule(schedule,'13',2027,2);expect(games).toHaveLength(2);expect(games[0].id).toMatch(/^espn-\d+$/);expect(games[0].home).toBe('espn-team-13');expect(()=>mapSchedule(schedule,'13',2026,2)).toThrow();expect(seasonForGame('2026-04-05T00:00:00Z')).toBe(2026);expect(seasonForGame('2026-10-22T00:00:00Z')).toBe(2027);});
 it('keeps preseason logs separate from regular season and current-team metadata',()=>{const pre=mapPlayerLogs(logs,'1966',2027,1);expect(pre.length).toBeGreaterThan(0);expect(pre[0].team?.id).toBe('espn-team-20');expect(pre.every(l=>l.playerId==='1966'&&l.season===2027)).toBe(true);expect(mapPlayerLogs(logs,'1966',2027,2)).toEqual([]);expect(averages(pre).find(s=>s.key==='points')?.value).toBe('9.0');expect(()=>mapPlayerLogs(logs,'1966',2026,1)).toThrow();});
 it('matches headshot URLs by player ID and rejects other people or hosts',()=>{expect(photo('https://a.espncdn.com/i/headshots/nba/players/full/1966.png','1966')).toBeTruthy();for(const url of ['https://a.espncdn.com/i/headshots/nba/players/full/3945274.png','http://a.espncdn.com/i/headshots/nba/players/full/1966.png','https://evil.example/1966.png'])expect(photo(url,'1966')).toBeUndefined();});
});

it('uses explicit requested-season metadata rather than an unrelated current-season header',()=>{const data=structuredClone(schedule) as typeof schedule & {requestedSeason?:typeof schedule.season};data.requestedSeason=structuredClone(schedule.season);data.season.year=2026;expect(mapSchedule(data,'13',2027,2)).toHaveLength(2);const stats={season:{year:2027,type:2},requestedSeason:{year:2026,type:2},team:{id:'13'},results:{stats:{categories:[{stats:[{name:'avgPoints',displayName:'Points per game',displayValue:'116.3'}]}]}}};expect(mapTeamStatistics(stats,'13',2026,2)[0].value).toBe('116.3');expect(()=>mapTeamStatistics(stats,'13',2027,2)).toThrow();});

it('maps division membership from season-scoped stable IDs without conference/name substitutions',()=>{const rows=mapDivision(division.meta,division.standings,2027,2);expect(rows).toHaveLength(5);expect(rows.find(r=>r.teamId==='espn-team-1')?.division).toBe('Southeast');expect(rows.every(r=>r.rank===null)).toBe(true);expect(()=>mapDivision(division.meta,division.standings,2026,2)).toThrow();expect(()=>mapDivision({...division.meta,isConference:true},division.standings,2027,2)).toThrow();});
