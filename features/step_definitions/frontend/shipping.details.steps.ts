import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { LoginPage } from "../../../pages/LoginPage";
import { ShoppingCartPage } from "../../../pages/ShoppingCartPage";
import { ShippingDetailsPage } from "../../../pages/ShippingDetailsPage";
import shippingData from "../../../data/shippingData.json";
import shoppingCartData from "../../../data/shoppingCartData.json";

//Background//
Given("the user is logged in", async function () {
  // login ใช้ storage state ที่ save ไว้แล้ว (reuse จาก step อื่น)
  await this.page.goto(
    "https://qa-practice.razvanvancea.ro/auth_ecommerce.html",
  );
  await this.page.waitForLoadState("networkidle");
});

//the user has items added to the shopping cart
Given("the user has items in the cart", async function () {
  this.shoppingCartPage = new ShoppingCartPage(this.page);

  // Loop the test data to select and add each item to the cart
  for (const item of shoppingCartData.selectItems) {
    await this.shoppingCartPage.addToCart(item.itemsName);

    // Wait until the cart row element is rendered on the page
    await this.page.waitForSelector(".cart-row", { state: "attached" });
  }
});

Given("the user has proceeded to checkout", async function () {
  this.shippingDetailsPage = new ShippingDetailsPage(this.page);
  await this.shoppingCartPage.checkOut();
});

//Positive Test Case
When(
  "the user fills in shipping details from positive data",
  async function () {
    const data = shippingData.positive[0];
    await this.shippingDetailsPage.ShippingDetails(
      data.phone,
      data.street,
      data.city,
      data.country,
    );
  },
);

//Negative Test Cases
When(
  "the user fills in shipping details from negative data",
  async function () {
    for (const data of shippingData.negative) {
      await this.shippingDetailsPage.ShippingDetails(
        data.phone,
        data.street,
        data.city,
        "country" in data ? data.country : "", //verify field country has a data
      );
    }
  },
);

//Positive Test Case
Then(
  "the user should be able to submit the order successfully",
  async function () {
    //find message Congrats in page
    const message = this.page.locator("#message").first();
    await expect(message).toBeVisible({ timeout: 5000 });
    await expect(message).toContainText("Congrats");
  },
);

Then("the address should be displayed correctly", async function () {
  const data = shippingData.positive[0];

  // expected format: "Street, City - Country"
  const expectedAddress = `${data.street}, ${data.city} - ${data.country}`;

  const message = this.page.locator("#message").first();
  await expect(message).toContainText(expectedAddress);
});

//Negative Test Cases
Then("the user should not be able to submit the order", async function () {
  //form display is enable
  await expect(this.page.locator("#shippingForm")).toBeVisible();
  //confirmation message doesn't display
  await expect(this.page.locator("#message").last()).toBeHidden();
});
