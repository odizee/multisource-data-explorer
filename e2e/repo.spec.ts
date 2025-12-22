import { test, expect } from "@playwright/test";

const repo = {
  id: 100,
  name: "react",
  full_name: "facebook/react",
  owner: {
    login: "facebook",
    avatar_url: "https://example.com/avatar.png",
    html_url: "",
  },
  html_url: "https://github.com/facebook/react",
  description: "A UI library",
  stargazers_count: 123456,
  language: "JavaScript",
  forks_count: 45678,
  open_issues_count: 123,
  updated_at: "2023-01-01T00:00:00Z",
};

test("repo detail renders and handles error", async ({ page }) => {
  await page.goto("/repo/facebook/react");
  await page.waitForLoadState("networkidle");

  await expect(
    page.getByRole("heading", { name: "facebook/react" })
  ).toBeVisible();
  await expect(page.getByText("View on GitHub")).toBeVisible();
  await expect(page.getByText("Stars")).toBeVisible();
  await expect(page.getByText("Forks")).toBeVisible();
  await expect(page.getByText("Open Issues")).toBeVisible();

  await page.goto("/repo/nope/notfound");
  await expect(page.getByText("Error")).toBeVisible();
  await expect(
    page.getByText("Failed to load repository details")
  ).toBeVisible();
  await expect(page.getByText("Back to Explorer")).toBeVisible();
});
