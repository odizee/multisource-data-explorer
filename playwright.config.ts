import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30 * 1000,
  retries: 0,
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    timeout: 120 * 1000,
    reuseExistingServer: true,
    env: {
      NEXT_PUBLIC_FAKESTORE_URL: "http://localhost:3000/api/mock/fakeStore",
      NEXT_PUBLIC_GITHUB_API_URL: "http://localhost:3000/api/mock/github",
      NEXT_PUBLIC_COUNTRIES_API_URL: "http://localhost:3000/api/mock/countries",
    },
  },
});
