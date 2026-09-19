import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const path of ["/", "/sunsets/"]) for (const width of [360, 390, 430, 768, 1363]) {
  test(`weather notice is accessible, dismissible and consistent on ${path} at ${width}px`, async ({page}) => {
    await page.setViewportSize({width,height:900});
    await page.emulateMedia({reducedMotion:"reduce"});
    await page.goto(path);
    const dialog = page.getByRole('dialog', {name:/Postponed due to weather/});
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('Ticket holders will be offered admission');
    await expect(dialog).toContainText('Untold Story');
    await expect(dialog).toContainText('artists are working together');
    await expect(dialog).not.toContainText(/10\.10|October 10/);
    await expect(dialog.locator('time')).toContainText('Chicago');
    const box = await dialog.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.x+box!.width).toBeLessThanOrEqual(width);
    expect(box!.y+box!.height).toBeLessThanOrEqual(900);
    for(let i=0;i<5;i++) {await page.keyboard.press('Tab');expect(await dialog.evaluate(el=>el.contains(document.activeElement))).toBe(true);}
    if ([390,1363].includes(width)) {
      const axe=await new AxeBuilder({page}).include('.event-notice').withTags(['wcag2a','wcag2aa']).analyze();
      expect(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.html)}))).toEqual([]);
      await dialog.evaluate(el=>el.scrollTop=0);
      await page.screenshot({path:`/tmp/weather-popup-${path==='/'?'monolith':'sunsets'}-${width}.png`});
    }
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await page.reload();
    await page.waitForTimeout(700);
    await expect(dialog).not.toBeVisible();
    const reopen=page.locator('[data-open-event-notice]');
    await reopen.click();
    await expect(dialog).toBeVisible();
    await dialog.getByRole('link',{name:/Full event update/}).click();
    await expect(page.locator('#event-update')).toBeVisible();
    await expect(page.getByRole('dialog',{name:/Postponed due to weather/})).not.toBeVisible();
    await expect(page.locator('#event-update')).toContainText('Untold Story');
  });
}

test('ticket and event pages carry the approved status without first-access sales copy', async ({page})=>{
  await page.goto('/tickets');
  await expect(page.getByRole('heading',{name:'Postponed due to weather.'})).toBeVisible();
  await expect(page.locator('main')).not.toContainText('FIRST ACCESS OPEN');
  await expect(page.locator('main')).toContainText('Untold Story');
  await page.goto('/events/css-sep19');
  await expect(page.locator('main')).toContainText('POSTPONED');
  await expect(page.locator('main')).not.toContainText('COMING SOON');
  await expect(page).toHaveTitle(/Postponed/);
});
