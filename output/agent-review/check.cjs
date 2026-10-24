const { chromium } = require('/private/tmp/hero-browser/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
    await page.clock.install();
    const sections = '#about, #skills, #experience, #projects, #contact';
    assert.equal(await page.locator(sections).count(), 0);
    assert.equal(await page.locator('.site-footer').count(), 0);
    assert.equal(await page.locator('.nav-link').count(), 0);
    await page.getByLabel('Open command palette').click();
    assert.equal(await page.getByText('Projects (SEVA, B2B, TraceGate)', { exact: true }).count(), 0);
    await page.keyboard.press('Escape');
    await page.screenshot({ path: 'output/agent-review/desktop-idle.png' });
    await page.getByRole('button', { name: 'Run the agent', exact: true }).click();
    assert(await page.getByRole('button', { name: 'Agent is running…', exact: true }).isDisabled());
    for (let step = 0; step < 5; step++) {
      assert.equal(await page.locator(sections).count(), 0, 'Content must stay hidden until all steps finish');
      assert.equal(await page.locator('.agent-steps li[data-state="complete"]').count(), step);
      assert.equal(await page.locator('.agent-steps li[data-state="active"]').count(), 1);
      if (step === 2) await page.screenshot({ path: 'output/agent-review/desktop-running.png' });
      await page.clock.runFor(900);
    }
    assert.equal(await page.locator(sections).count(), 5);
    assert.equal(await page.locator('.agent-steps li[data-state="complete"]').count(), 5);
    assert.equal(await page.locator('.agent-steps li[data-state="active"]').count(), 0);
    assert.equal(await page.locator('.site-footer').count(), 1);
    assert.equal(await page.evaluate(() => document.activeElement.id), 'portfolio');
    await page.clock.runFor(1500);
    await page.screenshot({ path: 'output/agent-review/desktop-revealed.png' });
    await page.getByRole('link', { name: 'Projects', exact: true }).click();
    await page.clock.runFor(1500);
    console.log('Project navigation:', await page.locator('#projects').evaluate(el => ({ top: el.getBoundingClientRect().top, hash: location.hash })));
    assert.equal(new URL(page.url()).hash, '#projects');
    await page.waitForFunction(() => Math.abs(document.querySelector('#projects').getBoundingClientRect().top - 104) < 10);
    for (const width of [320, 390, 768, 1024]) {
      await page.setViewportSize({ width, height: 844 });
      await page.reload({ waitUntil: 'networkidle' });
      assert.equal(await page.locator(sections).count(), 0);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
      await page.getByRole('button', { name: 'Run the agent', exact: true }).click();
      await page.clock.runFor(1800);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
      if (width === 390) await page.screenshot({ path: 'output/agent-review/mobile-running.png' });
      await page.clock.runFor(3000);
      assert.equal(await page.locator(sections).count(), 5);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload({ waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Run the agent', exact: true }).focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('.agent-spinner').first().evaluate(el => getComputedStyle(el).animationName), 'none');
    await page.clock.runFor(4700);
    assert.equal(await page.locator(sections).count(), 5);
    assert.equal(await page.evaluate(() => document.activeElement.id), 'portfolio');
    assert.deepEqual(errors, []);
    console.log('PASS: hero-only start, all five stages gate content, disabled duplicate runs, navigation, focus transfer, refresh reset, 320/390/768/1024/1440 widths, keyboard launch, reduced motion, no browser errors.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
