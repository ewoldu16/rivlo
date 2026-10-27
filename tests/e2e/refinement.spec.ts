import {test,expect} from '@playwright/test';
import summary from '../fixtures/phase24-summary.json' with {type:'json'};
import core from '../fixtures/phase24-core.json' with {type:'json'};
import {mapSummary} from '../../src/data/espn/mapping';
import {mapPlayByPlay} from '../../src/data/espn/play-by-play-mapping';

test('game content shares boundaries and the feed grid adapts without clipping',async({page})=>{
 const game=mapSummary(summary,new Date().toISOString()),feed=mapPlayByPlay(summary,game.id,new Date().toISOString(),'ESPN Core',core.items);
 await page.route('**/api/nba?**',r=>r.fulfill({json:{games:[game],teams:[game.homeTeam,game.awayTeam],playByPlay:feed,fetchedAt:new Date().toISOString(),stale:false,warnings:[]}}));
 await page.goto(`/games/${game.id}?section=feed`);
 await expect(page.locator('.game-targets')).toHaveAttribute('data-empty','true');
 for(const width of [390,430,650,700,759,760,768,1023,1024,1440]){
  await page.setViewportSize({width,height:1000});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const header=(await page.locator('.match-header').boundingBox())!,targets=(await page.locator('.game-targets').boundingBox())!,panel=(await page.locator('.game-panel').boundingBox())!,left=(await page.locator('.live-plays').boundingBox())!,right=(await page.locator('.game-context').boundingBox())!;
  for(const rect of [targets,panel]){expect(Math.abs(rect.x-header.x)).toBeLessThan(1);expect(Math.abs(rect.width-header.width)).toBeLessThan(1)}
  expect(Math.abs(left.x-header.x)).toBeLessThan(1);
  if(width>=1024){
   expect(Math.abs(left.y-right.y)).toBeLessThan(1);
   expect(Math.abs(right.x+right.width-header.x-header.width)).toBeLessThan(1);
   expect(left.width/(left.width+right.width)).toBeGreaterThan(.64);
   expect(left.width/(left.width+right.width)).toBeLessThan(.66);
   const feedHeading=(await page.locator('.live-plays .game-surface-heading').boundingBox())!,contextHeading=(await page.locator('.context-periods .game-surface-heading').boundingBox())!;
   expect(Math.abs(feedHeading.height-contextHeading.height)).toBeLessThan(1);
  }else{expect(Math.abs(left.width-right.width)).toBeLessThan(1);expect(right.y).toBeGreaterThanOrEqual(left.y+left.height)}
  const trackerLink=(await page.locator('.game-target-heading>a').boundingBox())!;
  expect(trackerLink.height).toBeGreaterThanOrEqual(44);
 }
 await page.setViewportSize({width:1440,height:1000});
 await page.getByRole('button',{name:'Stats',exact:true}).click();
 const stats=(await page.locator('.game-panel-stats').boundingBox())!,header=(await page.locator('.match-header').boundingBox())!;
 expect(Math.abs(stats.x-header.x)).toBeLessThan(1);expect(Math.abs(stats.width-header.width)).toBeLessThan(1);
});
