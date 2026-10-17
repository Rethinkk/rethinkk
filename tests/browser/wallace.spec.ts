import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("Native chapter, research profiles and existing DDI route", async ({
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
      name: "Explore the evidence.",
    }),
  ).toBeVisible();
  await expect(page.locator(".wi-card")).toHaveCount(5);
  await expect(
    page.getByText(
      "Research profiles — conditional proposals, not official scores",
    ),
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
      "/wallace-index/explore",
      "/wallace-index/leaders/olaf-scholz",
      "/wallace-index/compare?research=1&leaders=olaf-scholz,barack-obama",
      "/wallace-index/sources/GS_OS02?research=1",
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

test("Research filters, Scholz caveat, claim provenance and independent visitor selection", async ({
  page,
  request,
}) => {
  await page.goto("/wallace-index/explore");
  await page.getByLabel("Leader name").fill("Scholz");
  await expect(page.locator(".wi-card")).toHaveCount(1);
  await expect(page.locator(".wi-card")).toContainText(
    "not a finding of misconduct",
  );
  await page.getByLabel("Leader name").clear();
  await page.getByLabel("Compare Olaf Scholz").check();
  await page.getByLabel("Compare Barack Obama").check();
  await page.getByRole("link", { name: "Compare selected (2)" }).click();
  await expect(page.getByRole("table")).toContainText(
    "not a finding of misconduct",
  );
  await page.getByRole("link", { name: "Olaf Scholz", exact: true }).click();
  await expect(page.locator("#service")).toContainText(
    "Insufficient evidence — not assessed",
  );
  await expect(
    page.getByRole("heading", { name: "Concept assessment" }),
  ).toHaveCount(6);
  await page.locator("#service").getByRole("link").first().click();
  await expect(
    page.getByRole("heading", { name: "Linked profiles and claims" }),
  ).toBeVisible();
  await expect(
    page.getByText("Original publication", { exact: true }),
  ).toBeVisible();
  const response = await request.get("/api/wallace-index/research");
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data.profiles).toHaveLength(5);
  expect(data.officialScoresAssigned).toBe(false);
  expect(data.independentReviewCompleted).toBe(false);
  await page.goto("/wallace-index/assess");
  await page
    .getByLabel("Choose a leader profile")
    .selectOption("research:olaf-scholz");
  await expect(page.getByLabel("Leader or temporary profile name")).toHaveValue(
    "Olaf Scholz",
  );
});

test("Current results show four conditional proposals with reasons and no complete totals", async ({
  page,
  request,
}) => {
  await page.goto("/wallace-index");
  await expect(
    page.getByRole("heading", { name: "Current research results" }),
  ).toBeVisible();
  const table = page.getByRole("table");
  await expect(
    table.getByText("1 / 3 — conditional proposal", { exact: true }),
  ).toHaveCount(3);
  await expect(
    table.getByText("2 / 3 — conditional proposal", { exact: true }),
  ).toHaveCount(1);
  await expect(table.getByText("Not calculated", { exact: true })).toHaveCount(
    5,
  );
  await page.goto("/wallace-index/leaders/boris-johnson?research=1#process");
  await expect(page.locator("#process")).toContainText(
    "1 / 3 — conditional proposal",
  );
  await expect(page.locator("#process")).toContainText(
    "Why adjacent scores differ",
  );
  await expect(page.locator("#process")).toContainText(
    "Unresolved conditions before acceptance",
  );
  await page.goto(
    "/wallace-index/compare?research=1&leaders=boris-johnson,barack-obama",
  );
  await expect(page.getByRole("table")).toContainText(
    "2 / 3 — conditional proposal",
  );
  await expect(page.getByRole("table")).toContainText("Before acceptance:");
  const response = await request.get("/api/wallace-index/research");
  const data = await response.json();
  expect(data.schema).toBe("wallace-qualitative-research-2");
  expect(data.officialScoresAssigned).toBe(false);
  expect(
    data.profiles
      .flatMap((p: { dimensions: { proposal: unknown }[] }) => p.dimensions)
      .filter((d: { proposal: unknown }) => d.proposal),
  ).toHaveLength(4);
});
