import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import raw from '../fixtures/espn-scoreboard.json' with {type:'json'};
import summary from '../fixtures/espn-summary.json' with {type:'json'};
import {mapScoreboard,mapSummary} from '../../src/data/espn/mapping';
const at='2026-10-18T12:00:00.000Z';
const recorded=mapScoreboard(raw,at).games;
async function mockSource(page:import('@playwright/test').Page){await page.route('**/api/nba?**',async route=>{const url=new URL(route.request().url());const games=url.searchParams.has('game')?[mapSummary(summary,at)]:url.searchParams.get('date')==='2026-06-05'?recorded:[];await route.fulfill({json:{games,teams:recorded.flatMap(g=>[g.homeTeam,g.awayTeam]),fetchedAt:at,stale:false,warnings:[]}});});}
test('ESPN preview mode, isolated follows, search and direct game reload',async({page})=>{
 await mockSource(page);await page.goto('/preferences');await page.locator('summary').filter({hasText:'Data source'}).click();await page.getByRole('button',{name:'ESPN preview',exact:true}).click();await expect(page.getByRole('link',{name:'Data source preferences'})).toHaveText('ESPN preview · unofficial data');
 await page.goto('/?mode=espn&date=2026-06-05');await expect(page.locator('.fixture')).toHaveCount(1);await expect(page.locator('.fixture').first().locator('.score').first()).toHaveText('104');await expect(page.getByRole('button',{name:'Play sample update'})).toHaveCount(0);
 await page.getByRole('button',{name:'Follow San Antonio Spurs'}).click();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('project01.espn-favourites.v1')||'[]'))).toContain('espn-team-24');expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('project01.preferences.v1')||'{"favourites":[]}').favourites)).toEqual([]);
 await page.getByRole('link',{name:/Favourites/}).click();await page.getByRole('button',{name:'Games',exact:true}).click();await expect(page.locator('.fixture')).toHaveCount(1);await page.getByRole('button',{name:'Search teams and games'}).click();await page.getByRole('textbox',{name:'Search teams or fixtures'}).fill('Knicks');await page.locator('dialog a').first().click();await expect(page).toHaveURL(/games\/espn-401859964/);await page.reload();await expect(page.locator('.match-score strong').last()).toHaveText('104');await expect(page.locator('.match-dateline').getByText('Frost Bank Center',{exact:true})).toBeVisible();await expect(page.locator('tbody tr').first().locator('td').last()).toHaveText('104');
 await page.goto('/preferences');await page.locator('summary').filter({hasText:'Data source'}).click();await page.getByRole('button',{name:'Fictional demo'}).click();await page.goto('/');await expect(page.locator('.fixture')).toHaveCount(8);await expect(page.locator('.fixture').first().getByRole('button',{name:'Follow Uptown Orbit'})).toBeVisible();
});
test('date requests, empty schedule, errors and retry without demo fallback',async({page})=>{
 await mockSource(page);await page.goto('/?mode=espn&date=2026-06-05');await expect(page.locator('.fixture')).toHaveCount(1);await page.getByLabel('NBA schedule date', {exact:true}).fill('2026-06-06');await expect(page.locator('.fixture')).toHaveCount(0);await expect(page.getByText('No games on this view.')).toBeVisible();await page.getByRole('button',{name:'Explore 5 June 2026'}).click();await expect(page.locator('.fixture')).toHaveCount(1);
 await page.unroute('**/api/nba?**');await page.route('**/api/nba?**',route=>route.fulfill({status:502,json:{error:'Provider unavailable. Try again.'}}));await page.getByRole('button',{name:'Refresh ESPN data'}).click();await expect(page.getByText('Schedule unavailable.')).toBeVisible();await expect(page.locator('.fixture')).toHaveCount(0);
 await page.unroute('**/api/nba?**');await mockSource(page);await page.getByRole('button',{name:'Try again'}).click();await expect(page.locator('.fixture')).toHaveCount(1);
});
test('preview logo fallback, stale disclosure and accessibility across widths',async({page})=>{
 await page.route('https://a.espncdn.com/**',route=>route.abort());await mockSource(page);await page.goto('/?mode=espn&date=2026-06-05');await expect(page.locator('.fixture')).toHaveCount(1);
 for(const width of [360,390,768,1440]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 await page.route('**/api/nba?**',route=>route.fulfill({json:{games:recorded,teams:recorded.flatMap(g=>[g.homeTeam,g.awayTeam]),fetchedAt:at,stale:true,warnings:['Showing cached data.']}}));await page.getByRole('button',{name:'Refresh ESPN data'}).click();await expect(page.getByText(/Cached snapshot · may be out of date/)).toBeVisible();
});
test('out-of-order responses never replace the newly selected date',async({page})=>{
 await page.route('**/api/nba?**',async route=>{const date=new URL(route.request().url()).searchParams.get('date');if(date==='2026-06-05')await new Promise(resolve=>setTimeout(resolve,300));await route.fulfill({json:{games:date==='2026-06-05'?recorded:[],teams:recorded.flatMap(g=>[g.homeTeam,g.awayTeam]),fetchedAt:at,stale:false,warnings:[]}}).catch(()=>{});});
 await page.goto('/?mode=espn&date=2026-06-05');await page.getByLabel('NBA schedule date',{exact:true}).fill('2026-06-06');await expect(page.getByText('No games on this view.')).toBeVisible();await expect(page.locator('.fixture')).toHaveCount(0);await expect(page.getByLabel('NBA schedule date',{exact:true})).toHaveValue('2026-06-06');
});

test('malformed client contract fails visibly and can recover',async({page})=>{
 await page.route('**/api/nba?**',route=>route.fulfill({json:{games:[{}]}}));await page.goto('/?mode=espn&date=2026-06-05');await expect(page.getByText('Schedule unavailable.')).toBeVisible();await expect(page.locator('.fixture')).toHaveCount(0);await page.unroute('**/api/nba?**');await mockSource(page);await page.getByRole('button',{name:'Try again'}).click();await expect(page.locator('.fixture')).toHaveCount(1);
});
