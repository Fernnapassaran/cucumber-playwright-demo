import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";

let loginPage: LoginPage;

Given("the user is on the login page", async function () {
  loginPage = new LoginPage(this.page);
  await loginPage.goto();
});

When(
  "the user logs in with username {string} and password {string}",
  async function (user, password) {
    await loginPage.login(user, password);
  },
);

Then("the user should see a shopping cart page", async function () {
  //verify page chage to url auth_ecommerce.html in 5 second
  await expect(this.page).toHaveURL(/.*auth_ecommerce.html/, {
    timeout: 5000,
  });
});

Then("the user should see {string}", async function (expectedResult) {
  //verify page chage to url auth_ecommerce.html in 5 second
  await expect(this.page.locator("#message.alert-danger"));
});
