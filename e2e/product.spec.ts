import { test, expect } from "@playwright/test";

const product = {
  id: 1,
  title: "E2E Product",
  price: 42.5,
  description: "Product description",
  category: "Electronics",
  image: "https://example.com/product.png",
  rating: { rate: 4.7, count: 123 },
};

test("product detail renders and handles error", async ({ page }) => {
  await page.goto("/product/1");
  await page.waitForLoadState("networkidle");

  await expect(page.getByRole("heading")).toBeVisible();
  await expect(page.getByText("Add to Cart")).toBeVisible();

  // Error state
  await page.goto("/product/9999");
  await expect(page.getByText("Error")).toBeVisible();
  await expect(page.getByText("Failed to load product details")).toBeVisible();
  await expect(page.getByText("Back to Explorer")).toBeVisible();
});
