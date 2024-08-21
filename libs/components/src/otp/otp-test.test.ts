import { test, expect } from '@playwright/test';

test.describe('OTP Component Tests', () => {
  test('should allow input into OTP fields and verify focus management', async ({
    page,
  }) => {
    await page.goto('http://localhost:6174/otp/hero');

    const inputs = page.locator('input[data-qui-otp-native-input]');

    await inputs.focus();
    // assumes 4 inputs
    await inputs.fill('1234');
    expect(inputs).toHaveValue('1234');

    // assumes 4 inputs
    const lastOtpItem = page.locator('div[data-qui-otp-item="3"]');
    await expect(lastOtpItem).toHaveAttribute('data-highlighted', '');
  });
});
