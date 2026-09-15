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
} finally {
  await browser.close();
}
