import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/browser",
  workers: 1,
  use: {
    baseURL: process.env.WALLACE_TEST_BASE_URL || "http://127.0.0.1:3000",
    headless: true,
  },
  webServer: process.env.WALLACE_TEST_BASE_URL
    ? undefined
    : {
        command: "pnpm start",
        url: "http://127.0.0.1:3000",
        reuseExistingServer: false,
      },
  reporter: "list",
});
