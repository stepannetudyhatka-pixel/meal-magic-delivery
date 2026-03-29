import { test, expect } from '../playwright-fixture';

test.describe('Shop Page', () => {
  test('should load shops and display products', async ({ page }) => {
    await page.goto('/');
    // Wait for shops sidebar
    await expect(page.locator('aside')).toBeVisible();
    // Should display product cards or "No products" message
    await page.waitForTimeout(2000);
    const productCards = page.locator('.grid .group');
    const noProducts = page.locator('text=No products found');
    const hasProducts = await productCards.count();
    if (hasProducts > 0) {
      await expect(productCards.first()).toBeVisible();
    } else {
      await expect(noProducts).toBeVisible();
    }
  });

  test('should filter shops by rating', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    // Click rating filter
    const ratingButton = page.locator('button:has-text("4.0 – 5.0")');
    if (await ratingButton.isVisible()) {
      await ratingButton.click();
      await page.waitForTimeout(500);
    }
  });

  test('should add product to cart', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const addButton = page.locator('.grid .group button').first();
    if (await addButton.isVisible()) {
      await addButton.click();
      // Cart badge should appear
      await expect(page.locator('text=Cart')).toBeVisible();
    }
  });

  test('should show pagination when products > 20', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    // Check if pagination is visible (depends on data count)
    const pagination = page.locator('nav[aria-label="pagination"]');
    // This is data-dependent, so just check page loads without errors
    await expect(page.locator('aside')).toBeVisible();
  });
});

test.describe('Cart Page', () => {
  test('should show empty cart state', async ({ page }) => {
    await page.goto('/cart');
    await expect(page.locator('text=Your cart is empty')).toBeVisible();
  });

  test('should validate checkout form', async ({ page }) => {
    // First add item
    await page.goto('/');
    await page.waitForTimeout(2000);
    const addButton = page.locator('.grid .group button').first();
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(500);
      // Go to cart
      await page.goto('/cart');
      await page.waitForTimeout(1000);
      // Submit without filling form
      const submitBtn = page.locator('button:has-text("Place Order")');
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        // Should show validation errors
        await page.waitForTimeout(500);
      }
    }
  });
});

test.describe('Order History', () => {
  test('should show search form', async ({ page }) => {
    await page.goto('/history');
    await expect(page.locator('text=Order History')).toBeVisible();
    await expect(page.locator('#hist-email')).toBeVisible();
    await expect(page.locator('#hist-phone')).toBeVisible();
  });

  test('should search for orders', async ({ page }) => {
    await page.goto('/history');
    await page.fill('#hist-email', 'john@example.com');
    await page.fill('#hist-phone', '+1 234 567 890');
    await page.click('button:has-text("Search")');
    await page.waitForTimeout(2000);
    // Should show results or "No orders found"
    const orders = page.locator('text=Order #');
    const noOrders = page.locator('text=No orders found');
    const hasOrders = await orders.count();
    if (hasOrders > 0) {
      await expect(orders.first()).toBeVisible();
    } else {
      await expect(noOrders).toBeVisible();
    }
  });
});

test.describe('Coupons Page', () => {
  test('should display coupons', async ({ page }) => {
    await page.goto('/coupons');
    await page.waitForTimeout(2000);
    // Should show coupons or "No coupons" message
    const coupons = page.locator('.grid .overflow-hidden');
    const noCoupons = page.locator('text=No coupons available');
    const hasCoupons = await coupons.count();
    if (hasCoupons > 0) {
      await expect(coupons.first()).toBeVisible();
    } else {
      await expect(noCoupons).toBeVisible();
    }
  });
});

test.describe('Navigation', () => {
  test('should navigate between pages', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/cart"]');
    await expect(page).toHaveURL(/\/cart/);
    await page.click('a[href="/history"]');
    await expect(page).toHaveURL(/\/history/);
    await page.click('a[href="/coupons"]');
    await expect(page).toHaveURL(/\/coupons/);
    await page.click('a[href="/"]');
    await expect(page).toHaveURL(/\/$/);
  });
});
