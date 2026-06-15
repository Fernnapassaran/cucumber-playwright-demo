import { type Locator, type Page } from "@playwright/test";

export class LoginPage {
  //declare a variable
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  //Identify the locator
  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator("#email");
    this.passwordInput = page.locator("#password");
    this.loginButton = page.locator("#submitLoginBtn");
  }

  //action
  //step 1
  async goto() {
    //go to the web
    await this.page.goto(
      "https://qa-practice.razvanvancea.ro/auth_ecommerce.html",
    );
  }

  //Step2
  async login(user: string, password: string) {
    //Scroll to the input box so it is visible on mobile screens
    await this.usernameInput.scrollIntoViewIfNeeded();
    //Wait for the input box to be visible before typing
    await this.usernameInput.waitFor({ state: "visible" });
    //Fill username
    await this.usernameInput.fill(user);
    //Fill password
    await this.passwordInput.fill(password);
    // Scroll to the button
    await this.loginButton.scrollIntoViewIfNeeded();
    //click it
    await this.loginButton.click();
  }
}
