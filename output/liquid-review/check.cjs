const { chromium } = require('/private/tmp/hero-browser/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:5174/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    if (process.argv.includes('--capture')) {
      for (const element of await page.locator('[data-reveal]').all()) {
        await element.scrollIntoViewIfNeeded();
        await page.waitForTimeout(100);
      }
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(1100);
      await page.screenshot({ path: 'output/liquid-review/full-light.png', fullPage: true });
      console.log('Captured the complete page after scrolling through its reveals.');
      return;
    }
    assert.equal(await page.locator('#portfolio section').count(), 5, 'Content immediately available');
    assert.equal(await page.locator('#portfolio section').first().getAttribute('id'), 'projects');
    assert.equal(await page.locator('.nav-link').count(), 5);
    await page.screenshot({ path: 'output/liquid-review/desktop-light.png' });
    await page.locator('.nav-link').first().hover();
    await page.waitForTimeout(600);
    const firstHighlight = await page.locator('.nav-indicator').boundingBox();
    await page.locator('.nav-link').last().hover();
    await page.waitForTimeout(600);
    const lastHighlight = await page.locator('.nav-indicator').boundingBox();
    assert(lastHighlight.x > firstHighlight.x, 'Navigation highlight slides');
    await page.getByRole('button', { name: 'Switch to dark theme' }).click();
    assert(await page.locator('.liquid-splash').count() > 0, 'Click creates a ripple');
    await page.waitForTimeout(800);
    assert.equal(await page.locator('.liquid-splash').count(), 0, 'Ripple cleaned up');
    await page.screenshot({ path: 'output/liquid-review/desktop-dark.png' });
    await page.getByRole('button', { name: 'Switch to light theme' }).focus();
    await page.keyboard.press('Enter');
    assert(await page.locator('.liquid-splash').count() > 0, 'Keyboard activation ripples');
    await page.waitForTimeout(800);
    await page.locator('.nav-link[href="#projects"]').click();
    await page.waitForTimeout(1200);
    assert.equal(await page.locator('.nav-link[aria-current]').getAttribute('href'), '#projects');
    assert(await page.locator('#projects').evaluate(el => el.getBoundingClientRect().top > 95), 'Anchor clears header');
    await page.screenshot({ path: 'output/liquid-review/projects.png' });
    for (const width of [320, 390, 560, 768, 1024, 1100, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(200);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No overflow at ${width}`);
      const header = await page.locator('.navbar-bar').boundingBox();
      assert(header.x >= 0 && header.x + header.width <= width, `Header fits ${width}`);
      if (width < 1100) {
        await page.getByRole('button', { name: 'Open menu', exact: true }).click();
        assert.equal(await page.locator('#mobile-navigation a').count(), 5);
        await page.waitForTimeout(550);
        if (width === 390) await page.screenshot({ path: 'output/liquid-review/mobile-menu.png' });
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#mobile-navigation').count(), 0);
        await page.getByRole('button', { name: 'Open menu', exact: true }).click();
        await page.locator('#mobile-navigation a[href="#projects"]').click();
        assert.equal(await page.locator('#mobile-navigation').count(), 0);
      } else {
        const nav = await page.locator('.navbar-links').boundingBox();
        const brand = await page.locator('header .brand').boundingBox();
        const actions = await page.locator('.navbar-actions').boundingBox();
        assert(brand.x + brand.width < nav.x && nav.x + nav.width < actions.x, `No navbar overlap at ${width}`);
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(900);
    await page.screenshot({ path: 'output/liquid-review/mobile-light.png' });
    await page.getByRole('button', { name: 'Open menu', exact: true }).click();
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.waitForTimeout(200);
    assert.equal(await page.locator('#mobile-navigation').count(), 0, 'Resize closes mobile menu');
    await page.locator('.nav-link[href="#skills"]').click();
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Backend & DB', exact: true }).click();
    assert.equal(await page.locator('.skill-card').count(), 1);
    assert(await page.locator('.skill-card').innerText().then(t => t.includes('FASTAPI')));
    await page.getByRole('button', { name: 'All capabilities', exact: true }).click();
    assert.equal(await page.locator('.skill-card').count(), 3);
    await page.getByRole('button', { name: 'Pause site animations' }).click();
    assert.equal(await page.locator('.site-shell').getAttribute('data-motion'), 'off');
    assert.equal(await page.locator('.motion-pending').count(), 0);
    await page.getByRole('button', { name: 'Switch to dark theme' }).click();
    assert.equal(await page.locator('.liquid-splash').count(), 0, 'Paused controls do not animate');
    await page.getByRole('button', { name: 'Play site animations' }).click();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(100);
    assert.equal(await page.locator('.site-shell').getAttribute('data-motion'), 'off');
    assert(await page.getByRole('button', { name: 'Motion disabled by system preference' }).isDisabled());
    await page.getByRole('button', { name: 'Switch to light theme' }).click();
    assert.equal(await page.locator('.liquid-splash').count(), 0, 'System reduced motion disables ripples');
    await page.keyboard.press('Control+k');
    await page.getByRole('textbox', { name: 'Search commands' }).fill('projects');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);
    assert.equal(await page.getByRole('dialog', { name: 'Quick commands' }).count(), 0);
    await page.locator('.brand').click();
    await page.locator('.hero-demo summary').click();
    await page.getByRole('button', { name: 'Run the agent', exact: true }).click();
    await page.getByRole('button', { name: 'Walkthrough complete', exact: true }).waitFor({ timeout: 7000 });
    assert.equal(await page.locator('#portfolio section').count(), 5);
    assert.equal(await page.locator('#agent-progress progress').getAttribute('value'), '5');
    const cv = await page.request.get('http://127.0.0.1:5174/Utpal_Kant_Sharma_Resume.pdf');
    assert.equal(cv.status(), 200);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.locator('.hero-demo summary').click();
    // Reveal all content for the review artifact.
    for (const section of await page.locator('[data-reveal]').all()) {
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(250);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'output/liquid-review/full-light.png', fullPage: true });
    const touchPage = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await touchPage.goto('http://127.0.0.1:5174/', { waitUntil: 'networkidle' });
    await touchPage.getByRole('button', { name: 'Switch to dark theme' }).tap();
    assert(await touchPage.locator('.liquid-splash').count() > 0, 'Touch creates a ripple');
    await touchPage.waitForTimeout(800);
    await touchPage.screenshot({ path: 'output/liquid-review/mobile-dark.png' });
    await touchPage.close();
    assert.deepEqual(errors, []);
    console.log('PASS: immediate content, sliding navigation, pointer/keyboard ripples and cleanup, 8 responsive widths, mobile navigation, active sections, filters, pause/reduced motion, command palette, agent demo, CV, and no browser errors.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
