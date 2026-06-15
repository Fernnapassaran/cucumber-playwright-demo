import { Before, After, Status } from "@cucumber/cucumber";
import { chromium, Browser, BrowserContext } from "@playwright/test";
import { authenticate } from "./auth.setup";
import * as fs from "fs";

//variables to store browser states
const authFile = "playwright/.auth/user.json";
let browser: Browser;
let context: BrowserContext;

Before(async function (scenario) {
  if (scenario.pickle.tags.some((t) => t.name === "@login")) return;

  // Login and save session every time
  await authenticate();

  // Open browser with saved session
  browser = await chromium.launch({
    headless: true,
  });
  context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    storageState: authFile,
  });
  this.page = await context.newPage();
});

//Only the login tags part
Before({ tags: "@login" }, async function () {
  //open a new browser instance and open a clean tab
  browser = await chromium.launch({
    headless: true,
  });
  context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  this.page = await context.newPage();
});

//after each scenario completes
After(async function (scenario) {
  // Take a screenshot if the scenario fails
  if (scenario.result?.status === Status.FAILED) {
    const screenshot = await this.page.screenshot();
    this.attach(screenshot, "image/png");
  }

  // Close the browser to free up system memory
  await this.page.close();
  await context.close();
  await browser.close();
});
