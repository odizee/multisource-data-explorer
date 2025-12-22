import { test, expect } from "@playwright/test";

const productsFixture = Array.from({ length: 7 }).map((_, i) => ({
  id: i + 1,
  title: i === 0 ? "Laptop Pro" : `Product ${i + 1}`,
  price: 10 + i,
  description: `Description ${i + 1}`,
  category: i % 2 === 0 ? "Electronics" : "Clothing",
  image: "https://example.com/image.png",
  rating: { rate: 4.5, count: 10 + i },
}));

const reposFixture = {
  total_count: 2,
  incomplete_results: false,
  items: [
    {
      id: 1001,
      name: "bar",
      full_name: "foo/bar",
      owner: { login: "foo", avatar_url: "", html_url: "" },
      html_url: "https://github.com/foo/bar",
      description: "Test repository",
      stargazers_count: 1234,
      language: "TypeScript",
      forks_count: 567,
      open_issues_count: 1,
      updated_at: "2023-01-01T00:00:00Z",
    },
    {
      id: 1002,
      name: "qux",
      full_name: "baz/qux",
      owner: { login: "baz", avatar_url: "", html_url: "" },
      html_url: "https://github.com/baz/qux",
      description: null,
      stargazers_count: 999,
      language: null,
      forks_count: 10,
      open_issues_count: 0,
      updated_at: "2023-01-02T00:00:00Z",
    },
  ],
};

test.beforeEach(async ({ page }) => {
  await page.route(
    "https://fakestoreapi.com/products?limit=100",
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(productsFixture),
      });
    }
  );

  await page.route(
    /https:\/\/api\.github\.com\/search\/repositories.*/,
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(reposFixture),
      });
    }
  );
});

test("home explorer renders datasets and supports search and toggles", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByText("Data Explorer")).toBeVisible();

  // Wait for pagination to appear which implies products loaded
  await expect(page.getByText("Page 1 of 2")).toBeVisible();
  // Products rendered and truncated to 5
  await expect(page.getByText("Laptop Pro")).toBeVisible();
  await expect(page.getByText("Product 2")).toBeVisible();
  await expect(page.getByText("Product 5")).toBeVisible();

  // Repositories rendered
  await expect(page.getByText("foo/bar")).toBeVisible();
  await expect(page.getByText("baz/qux")).toBeVisible();
  await expect(page.getByText("No description available")).toBeVisible();

  // Search filters products (debounced)
  await page.fill('input[placeholder="Search products..."]', "electronics");
  await page.waitForTimeout(600);
  await expect(page.getByText("Laptop Pro")).toBeVisible();
  await expect(page.getByText("Product 2")).not.toBeVisible();

  // Toggle products off
  await page.getByLabel("Toggle Products").click();
  await expect(page.getByText("Dataset disabled")).toBeVisible();

  // Toggle repos off
  await page.getByLabel("Toggle Repositories").click();
  await expect(page.locator("text=Dataset disabled")).toHaveCount(2);
});
