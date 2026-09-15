import { chromium } from 'file:///C:/Users/timot/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core/index.mjs';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1.5 });
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  await page.goto('http://127.0.0.1:5174/', { waitUntil: 'domcontentloaded' });
  const svg = page.locator('svg[aria-label^="Interactive globe"]');
  await svg.waitFor();
  await svg.scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Pause rotation', exact: true }).click();
  if (process.argv.includes('--pointer')) {
    const hitPoint = (targetPage, code) => targetPage.locator(`[data-country-code="${code}"]`).evaluate(el => {
      const r = el.getBoundingClientRect();
      for (const fy of [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8]) {
        for (const fx of [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8]) {
          const x = r.left + r.width * fx, y = r.top + r.height * fy;
          if (document.elementFromPoint(x, y) === el) return { x, y };
        }
      }
      throw new Error('No visible country hit area: ' + el.getAttribute('data-country-code'));
    });
    const target = await hitPoint(page, 'GHA');
    await svg.evaluate(el => {
      window.globeEvents = [];
      for (const type of ['pointerdown', 'pointerup', 'click']) el.addEventListener(type, e => window.globeEvents.push({ type, target: e.target.tagName, country: e.target.getAttribute('data-country-code') }));
    });
    await page.mouse.click(target.x, target.y);
    await page.waitForTimeout(300);
    console.log('Mouse events:', await page.evaluate(() => window.globeEvents));
    assert.equal(await page.getByRole('button', { name: 'Reset view', exact: true }).count(), 1, 'Mouse click selects Ghana');
    assert.equal(await page.locator('[data-country-code="GHA"]').getAttribute('fill'), 'rgba(239, 68, 68, 0.58)');
    await page.getByRole('button', { name: '×', exact: true }).click();
    await page.waitForTimeout(1000);
    const nigeria = await hitPoint(page, 'NGA');
    await page.mouse.click(nigeria.x, nigeria.y, { button: 'right' });
    assert.equal(await page.getByRole('button', { name: '×', exact: true }).count(), 0, 'Right click does not select');
    await page.mouse.move(nigeria.x, nigeria.y);
    await page.mouse.down();
    await page.mouse.move(nigeria.x + 70, nigeria.y + 25, { steps: 15 });
    await page.mouse.up();
    await page.mouse.move(10, 10);
    await page.waitForTimeout(150);
    assert.equal(await page.getByRole('button', { name: '×', exact: true }).count(), 0, 'Drag does not select');
    const nextNigeria = await hitPoint(page, 'NGA');
    await page.mouse.click(nextNigeria.x, nextNigeria.y);
    await page.waitForTimeout(150);
    assert.equal(await page.locator('[data-country-code="NGA"]').getAttribute('fill'), 'rgba(239, 68, 68, 0.58)', 'Mouse click after drag selects Nigeria');
    await page.getByRole('button', { name: '×', exact: true }).click();
    await page.waitForTimeout(1000);
    await svg.locator('..').locator('..').locator('..').locator('..').screenshot({ path: '.tmp/globe-desktop-layout.png' });
    for (const width of [1024, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      await svg.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      console.log('Desktop canvas', width, await svg.boundingBox());
      await svg.locator('..').locator('..').locator('..').locator('..').screenshot({ path: `.tmp/globe-layout-${width}.png` });
    }
    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    await mobile.goto('http://127.0.0.1:5174/', { waitUntil: 'domcontentloaded' });
    const mobileSvg = mobile.locator('svg[aria-label^="Interactive globe"]');
    await mobileSvg.scrollIntoViewIfNeeded();
    await mobile.getByRole('button', { name: 'Pause rotation', exact: true }).click();
    const ghanaTouch = await hitPoint(mobile, 'GHA');
    await mobile.touchscreen.tap(ghanaTouch.x, ghanaTouch.y);
    await mobile.waitForTimeout(150);
    assert.equal(await mobile.locator('[data-country-code="GHA"]').getAttribute('fill'), 'rgba(239, 68, 68, 0.58)', 'Touch tap selects Ghana');
    await mobile.getByRole('button', { name: '×', exact: true }).click();
    await mobile.waitForTimeout(1000);
    const nigeriaTouch = await hitPoint(mobile, 'NGA');
    const cdp = await mobile.context().newCDPSession(mobile);
    const fingers = [{ x: nigeriaTouch.x, y: nigeriaTouch.y, id: 1 }, { x: nigeriaTouch.x + 40, y: nigeriaTouch.y + 30, id: 2 }];
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: fingers });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [fingers[0], { ...fingers[1], x: fingers[1].x + 35 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await mobile.waitForTimeout(150);
    assert.equal(await mobile.getByRole('button', { name: '×', exact: true }).count(), 0, 'Pinch does not select');
    const postPinch = await hitPoint(mobile, 'NGA');
    await mobile.touchscreen.tap(postPinch.x, postPinch.y);
    await mobile.waitForTimeout(150);
    assert.equal(await mobile.locator('[data-country-code="NGA"]').getAttribute('fill'), 'rgba(239, 68, 68, 0.58)', 'Tap after pinch selects Nigeria');
    await mobile.close();
    console.log('PASS: mouse and touch selection, drag/right-click/pinch suppression, selection after drag/pinch, desktop layout');
    process.exitCode = 0;
  } else {
  const input = page.getByRole('combobox').first();
  await input.fill('Brazil');
  await page.getByRole('option', { name: 'Brazil', exact: true }).click();
  await page.getByRole('button', { name: '×', exact: true }).click();
  await page.waitForTimeout(1200);
  const root = svg.locator('..');
  await root.screenshot({ path: '.tmp/globe-brazil.png' });
  console.log(await svg.evaluate(el => ({ canvas: el.previousElementSibling.firstElementChild.getBoundingClientRect().toJSON(), svg: el.getBoundingClientRect().toJSON(), viewBox: el.getAttribute('viewBox'), circle: el.querySelector('circle').outerHTML })));
  const dimensions = () => svg.evaluate(el => {
    const country = el.querySelector('[data-country-code="BRA"]').getBBox();
    return { radius: +el.querySelector('circle').getAttribute('r'), width: country.width, height: country.height };
  });
  const baseline = await dimensions();
  const box = await svg.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  for (const [label, delta, zoom] of [['zoom-in', -2500, 1.55], ['zoom-out', 5000, 0.88]]) {
    await page.mouse.wheel(0, delta);
    await page.waitForTimeout(350);
    const current = await dimensions();
    assert.ok(Math.abs(current.radius / baseline.radius - zoom) < 0.001, label + ' sphere radius');
    assert.ok(Math.abs(current.width / baseline.width - zoom) < 0.002, label + ' country width');
    assert.ok(Math.abs(current.height / baseline.height - zoom) < 0.002, label + ' country height');
    await root.screenshot({ path: `.tmp/globe-${label}.png` });
    console.log(label, current);
  }
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 90, box.y + box.height / 2 + 65, { steps: 20 });
  await page.mouse.up();
  await page.mouse.move(20, 20);
  await page.waitForTimeout(350);
  await root.screenshot({ path: '.tmp/globe-drag.png' });
  assert.equal(await page.getByRole('button', { name: 'Resume rotation', exact: true }).count(), 1);
  await page.setViewportSize({ width: 390, height: 844 });
  await svg.scrollIntoViewIfNeeded();
  await input.fill('Uganda');
  await page.getByRole('option', { name: 'Uganda', exact: true }).click();
  await page.getByRole('button', { name: '×', exact: true }).click();
  await page.waitForTimeout(1200);
  await root.screenshot({ path: '.tmp/globe-mobile.png' });
  await page.getByRole('button', { name: 'Resume rotation', exact: true }).click();
  await page.waitForTimeout(600);
  await page.getByRole('button', { name: 'Pause rotation', exact: true }).click();
  await root.screenshot({ path: '.tmp/globe-rotated.png' });
  await page.getByRole('button', { name: 'Reset view', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: 'Reset view', exact: true }).count(), 0);
  console.log('PASS: proportional zoom, drag without selection, mobile resize, country focus, rotation and reset');
  }
} finally {
  await browser.close();
}
