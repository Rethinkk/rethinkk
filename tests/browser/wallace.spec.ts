import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("Native chapter, empty official index and existing DDI route", async ({
  page,
}) => {
  await page.goto("/wallace-index");
  await expect(
    page.getByRole("heading", { name: "Leadership. Examined." }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Explore the index →", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "No editorial assessments published yet",
    }),
  ).toBeVisible();
  await page.goto("/index/democracy-direction");
  await expect(page).toHaveURL(/index\/democracy-direction/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
test("Fictional profiles filter, compare and expose evidence", async ({
  page,
}) => {
  await page.goto("/wallace-index/explore?demo=1");
  await expect(
    page.getByText("Demonstration only — entirely fictional profiles."),
  ).toBeVisible();
  await page.getByLabel("Leader name").fill("profile A");
  await expect(page.locator(".wi-card")).toHaveCount(1);
  await page.getByLabel("Leader name").clear();
  await page.getByLabel("Compare Demonstration profile A").check();
  await page.getByLabel("Compare Demonstration profile B").check();
  await page.getByRole("link", { name: "Compare selected (2)" }).click();
  await expect(page.getByRole("table")).toBeVisible();
  await page
    .getByRole("link", { name: "Demonstration profile A", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Assessment rationale" }).first(),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Fictional interface evidence fixture" })
    .first()
    .click();
  await expect(
    page.getByText("Supported and contextualised claims"),
  ).toBeVisible();
});
test("Visitor zero, incomplete total, persistence and independent export", async ({
  page,
}) => {
  await page.goto("/wallace-index/assess");
  await expect(
    page.getByText("Your assessment — not a RETHINKK editorial score."),
  ).toBeVisible();
  await page
    .getByLabel("Leader or temporary profile name")
    .fill("My local profile");
  const scores = page.getByLabel("Your score", { exact: true });
  await scores.first().selectOption("0");
  await expect(page.locator(".wi-total")).toContainText(
    "Incomplete assessment",
  );
  for (let i = 1; i < 6; i++) await scores.nth(i).selectOption("2");
  await expect(page.locator(".wi-total")).toContainText("10 / 18");
  await page.reload();
  await expect(page.getByLabel("Leader or temporary profile name")).toHaveValue(
    "My local profile",
  );
  await expect(page.locator(".wi-total")).toContainText("10 / 18");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download JSON" }).click();
  expect((await download).suggestedFilename()).toBe(
    "my-wallace-assessment.json",
  );
});
for (const width of [320, 768, 1280])
  test(`Accessibility and responsive layout at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/wallace-index",
      "/wallace-index/explore?demo=1",
      "/wallace-index/assess",
      "/wallace-index/methodology",
      "/wallace-index/compare?demo=1&edition=demonstration&leaders=demo-assessment-A,demo-assessment-B",
    ]) {
      await page.goto(path);
      await expect(page.locator("h1")).toHaveCount(1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBeTruthy();
      const results = await new AxeBuilder({ page })
        .include(".wi")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(results.violations).toEqual([]);
    }
  });
test("Unauthenticated editorial requests and cross-origin writes are rejected", async ({
  request,
}) => {
  const get = await request.get("/api/wallace-index/desk");
  expect(get.status()).toBe(401);
  const post = await request.post("/api/wallace-index/desk", {
    headers: { origin: "https://unrelated.example" },
    data: { action: "edition.publish" },
  });
  expect(post.status()).toBe(403);
});
