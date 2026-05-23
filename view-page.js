const { chromium } = require('playwright');

// Static routes
const routes = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/callback',
  '/products',
  '/products/cay-thien-ly', // dynamic: /products/[slug]
  '/cart',
  '/checkout',
  '/orders',
  '/orders/20bcb844-d282-435e-b2ba-8a09f929ff46',                 // dynamic: /orders/[id]
  '/profile',
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  for (const route of routes) {
    const name = route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '_');
    await page.goto(`http://localhost:3000${route}`);
    await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  await browser.close();
})();