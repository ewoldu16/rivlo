import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('responsive scores, accessibility and visible states',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [360,390,768,1440]){await page.setViewportSize({width,height:960});await page.goto('/');await expect(page.locator('.fixture')).toHaveCount(8);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:`docs/screenshots/scores-${width}.png`,fullPage:true,animations:'disabled'});}
 const scan=await new AxeBuilder({page}).analyze();expect(scan.violations).toEqual([]);
 await page.getByRole('button',{name:'Search teams and games'}).click();await page.getByRole('textbox',{name:'Search teams or fixtures'}).fill('Uptown');await page.screenshot({path:'docs/screenshots/search.png',animations:'disabled'});await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Search teams and games'})).toBeFocused();
 await page.goto('/preferences');await page.locator('summary').filter({hasText:'Theme'}).click();await page.getByRole('button',{name:'Arctic ice'}).click();await page.reload();await expect(page.locator('.app')).toHaveClass(/accent-ice/);await page.screenshot({path:'docs/screenshots/preferences.png',fullPage:true,animations:'disabled'});
 await page.goto('/favourites');await expect(page.getByText('Your courtside starts here.')).toBeVisible();await page.screenshot({path:'docs/screenshots/empty-favourites.png',fullPage:true,animations:'disabled'});
 await page.goto('/games/game-1-0');await expect(page.locator('.match-score strong').last()).toHaveText('103');await page.screenshot({path:'docs/screenshots/game-preview.png',fullPage:true,animations:'disabled'});await page.reload();await expect(page.getByText('Quarter by quarter')).toBeVisible();await page.goto('/games/missing');await expect(page.getByRole('heading',{name:'Game not found.'})).toBeVisible();expect(errors).toEqual([]);
});
test('follow separation, persistence, filters, sample update and search routing',async({page})=>{
 await page.goto('/');await page.locator('.fixture').first().getByRole('button',{name:'Follow Uptown Orbit'}).click();await expect(page).toHaveURL('/');await page.reload();await expect(page.locator('.fixture').first().getByRole('button',{name:'Unfollow Uptown Orbit'})).toBeVisible();
 await page.goto('/favourites');await page.getByRole('button',{name:'Games',exact:true}).click();await expect(page.locator('.fixture')).toHaveCount(1);await page.goto('/?date=2026-10-18&status=completed');await expect(page.getByText('No games on this view.')).toBeVisible();await page.getByRole('button',{name:'Reset filters'}).click();await expect(page.locator('.fixture')).toHaveCount(8);
 await page.getByRole('button',{name:'Play sample update'}).click();await expect(page.locator('.fixture').first().locator('.score').first()).toHaveText('105');await page.locator('.fixture-link').first().click();await expect(page.locator('.match-score strong').last()).toHaveText('105');
 await page.goto('/');await page.getByRole('button',{name:'Search teams and games'}).click();await page.getByRole('textbox',{name:'Search teams or fixtures'}).fill('Riverside');await page.locator('dialog a').first().click();await expect(page).toHaveURL(/games/);
 await page.goto('/');await page.evaluate(()=>localStorage.setItem('project01.preferences.v1','broken'));await page.reload();await expect(page.locator('.app')).toHaveClass(/accent-mint/);
});

test('keyboard dialog, reduced motion, sample reset and recoverable states',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'Skip to scores'})).toBeFocused();
 await page.getByRole('button',{name:'Search teams and games'}).click();await expect(page.getByRole('textbox',{name:'Search teams or fixtures'})).toBeFocused();await page.getByRole('textbox',{name:'Search teams or fixtures'}).fill('no-such-team');await expect(page.getByText('Try a city such as Uptown or Riverside.')).toBeVisible();expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Play sample update'}).click();await page.getByRole('button',{name:'Reset sample update'}).click();await expect(page.locator('.fixture').first().locator('.score').first()).toHaveText('103');
 await page.goto('/?scenario=error');await page.getByRole('button',{name:'Try again'}).click();await expect(page.locator('.fixture')).toHaveCount(8);
 for(const route of ['/preferences','/games/game-1-0','/favourites']){await page.goto(route);expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);}
});

test('redesigned mobile controls and incomplete quarter alignment',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.locator('.fixture')).toHaveCount(8);
 const nav=page.locator('nav');await expect(nav.getByRole('link',{name:/Scores/})).toBeVisible();const bounds=await nav.boundingBox();expect(bounds!.y+bounds!.height).toBeLessThanOrEqual(844);
 await page.screenshot({path:'docs/screenshots/redesign-dashboard-mobile.png',animations:'disabled'});
 await page.locator('.fixture-link').first().click();await expect(page.locator('.match-score strong').last()).toHaveText('103');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:'docs/screenshots/redesign-game-mobile.png',animations:'disabled'});
 await page.goto('/games/game-1-1');await expect(page.locator('tbody tr').first().locator('td')).toHaveCount(5);await expect(page.locator('tbody tr').first().locator('td').nth(3)).toHaveText('—');await expect(page.locator('tbody tr').first().locator('td').last()).toHaveText('70');
 await page.setViewportSize({width:1440,height:1000});await page.goto('/');await page.screenshot({path:'docs/screenshots/redesign-dashboard-desktop.png',fullPage:true,animations:'disabled'});await page.goto('/games/game-1-0');await page.screenshot({path:'docs/screenshots/redesign-game-desktop.png',fullPage:true,animations:'disabled'});
});
