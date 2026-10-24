const { chromium } = require('/private/tmp/hero-browser/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('header button').filter({ hasText: /sound/i }).count(), 0);
    assert.equal(await page.locator('header [aria-label*="sound"]').count(), 0);
    await page.getByRole('button', { name: 'Run the agent', exact: true }).click();
    await page.locator('#portfolio').waitFor();
    await page.waitForTimeout(900);
    assert.equal(await page.locator('.nav-link').count(), 5);
    await page.locator('.nav-link').first().hover();
    await page.waitForTimeout(400);
    assert.notEqual(await page.locator('.nav-link').first().evaluate(el => getComputedStyle(el).transform), 'none');
    await page.screenshot({ path: 'output/navbar-review/desktop.png' });
    await page.getByRole('button', { name: 'Pause site animations' }).click();
    await page.locator('.nav-link').first().hover();
    assert.equal(await page.locator('.nav-link').first().evaluate(el => getComputedStyle(el).transform), 'none');
    await page.getByRole('button', { name: 'Play site animations' }).click();
    for (const width of [320, 390, 768, 1024, 1100, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      const headerBounds = await page.locator('.navbar-bar').boundingBox();
      assert(headerBounds.x >= 0 && headerBounds.x + headerBounds.width <= width);
      if (width < 1100) {
        assert(!(await page.getByRole('navigation', { name: 'Main navigation', exact: true }).isVisible()));
        await page.getByRole('button', { name: 'Open menu', exact: true }).click();
        assert.equal(await page.locator('#mobile-navigation a').count(), 5);
        assert.equal(await page.locator('#mobile-navigation button').filter({ hasText: /sound/i }).count(), 0);
        await page.waitForTimeout(450);
        assert.equal((await page.locator('header').boundingBox()).y, 0);
        assert((await page.locator('header .brand').boundingBox()).y < 35);
        if (width === 390) await page.screenshot({ path: 'output/navbar-review/mobile.png' });
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#mobile-navigation').count(), 0);
        await page.getByRole('button', { name: 'Open menu', exact: true }).click();
        await page.getByRole('navigation', { name: 'Mobile navigation', exact: true }).getByRole('link', { name: 'Projects', exact: true }).click();
        assert.equal(await page.locator('#mobile-navigation').count(), 0);
      } else {
        assert(await page.getByRole('navigation', { name: 'Main navigation', exact: true }).isVisible());
        const nav = await page.locator('.navbar-links').boundingBox();
        const actions = await page.locator('.navbar-actions').boundingBox();
        const brand = await page.locator('header .brand').boundingBox();
        assert(brand.x + brand.width < nav.x && nav.x + nav.width < actions.x, `Navbar overlap at ${width}px`);
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole('button', { name: 'Open menu', exact: true }).click();
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.waitForTimeout(100);
    assert.equal(await page.locator('#mobile-navigation').count(), 0);
    await page.getByRole('button', { name: 'Switch to dark theme' }).click();
    await page.screenshot({ path: 'output/navbar-review/dark.png' });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('.nav-link').first().hover();
    assert.equal(await page.locator('.nav-link').first().evaluate(el => getComputedStyle(el).transform), 'none');
    assert.deepEqual(errors, []);
    console.log('PASS: sound buttons removed; 3D hover; pause/reduced motion; no overlaps at 320/390/768/1024/1100/1440; mobile links, Escape, desktop resize; dark theme; no browser errors.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
