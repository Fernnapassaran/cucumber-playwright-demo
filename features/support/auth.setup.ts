import { chromium, test as setup } from "@playwright/test";
import testData from "../../data/users.json";

// Set the file path to save the login state
const authFile = "playwright/.auth/user.json";

export async function authenticate() {
  const browser = await chromium.launch(); //open a new browser
  const context = await browser.newContext(); //open a new tap and clean cookie
  const page = await context.newPage(); //open the website

  //go to the web
  await page.goto("https://qa-practice.razvanvancea.ro/auth_ecommerce.html");

  // 2.input login
  console.log("login page");
  await page.locator("#email").fill(testData.validUser.username);
  console.log("fill username success");
  await page.locator("#password").fill(testData.validUser.password);
  console.log("fill password success");
  await page.locator("#submitLoginBtn").click();
  console.log("click button success");

  console.log("waiting for shop dashboard to load...");
  await page
    .getByRole("link", { name: "Log out" })
    .waitFor({ state: "visible", timeout: 5000 });
  console.log("login fully successful!");
  // 3. save the file JSON
  await page.context().storageState({ path: authFile });
  console.log("storage state saved successfully");

  await browser.close();
}
