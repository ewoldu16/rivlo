import {test,expect} from '@playwright/test';
test('shared navigation fits phones and reflects each existing route',async({page})=>{
 await page.setViewportSize({width:360,height:744});
 for(const [route,label] of [['/','Home — Scores'],['/favourites','Favourites'],['/preferences','More — Preferences']]){
  await page.goto(route);const nav=page.getByRole('navigation',{name:'Primary'});await expect(nav.getByRole('link',{name:label,exact:true})).toHaveAttribute('aria-current','page');await expect(nav.locator('[aria-current]')).toHaveCount(1);const box=await nav.boundingBox();expect(box!.x).toBeGreaterThanOrEqual(0);expect(box!.width).toBeLessThanOrEqual(360);await expect(page.getByRole('button',{name:'Search teams and games'})).toBeVisible();
 }
 await page.getByRole('link',{name:'Home — Scores'}).click();await expect(page.locator('.fixture')).toHaveCount(8);await page.locator('.fixture-link').first().click();await expect(page.getByRole('navigation').getByRole('link',{name:'Home — Scores'})).toHaveAttribute('aria-current','page');
});
