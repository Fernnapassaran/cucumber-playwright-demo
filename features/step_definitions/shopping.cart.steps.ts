import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { ShoppingCartPage } from "../../pages/ShoppingCartPage";

//Select items to cart//
//go to the website
Given("the user is on the shopping cart page", async function () {
  this.loginPage = new LoginPage(this.page);
  this.shoppingCartPage = new ShoppingCartPage(this.page);
  //go to the web
  await this.page.goto(
    "https://qa-practice.razvanvancea.ro/auth_ecommerce.html",
  );
  await this.page.waitForLoadState("networkidle");
  await expect(this.page).toHaveURL(/.*auth_ecommerce.html/);
});

//Select items to cart//
//verify add to cart step
When(
  "the user add items {string} and quantity {string}",
  async function (itemName, quantity) {
    const shoppingCartPage = this.shoppingCartPage;

    //add the specified item to the cart.
    await shoppingCartPage.addToCart(itemName);

    //find the item row and set the requested quantity.
    const itemRow = shoppingCartPage.getCartRow(itemName);
    await shoppingCartPage.setNumber(itemName, parseInt(quantity));

    //verify that the input field displays the correct quantity.
    const input = itemRow.locator("input.cart-quantity-input");
    //get the current value of the input field using JavaScript execution.
    const value = await input.evaluate((el: HTMLInputElement) => el.value);
    //verify the input value matches the expected quantity.
    expect(value).toBe(quantity);

    //verify the delete button inside the item row.
    const removeBtn = itemRow.locator(".btn-danger");

    //get the button's text directly from hidden elements.
    const removeText = await removeBtn.evaluate((el: HTMLElement) =>
      el.textContent.trim(),
    );

    //verify that the button text is exactly "REMOVE".
    expect(removeText).toBe("REMOVE");
  },
);

//convert string of names into an array of clean strings.
function itemsNameList(name: string): string[] {
  //split the text by commas and remove extra spaces from each item.
  return name.split(",").map((s) => s.trim());
}

//Total Cost for more Items//
When(
  "the user add more items {string} with price {string} and quantity {string}",
  async function (
    itemsList: string,
    priceList: string,
    quantitiesList: string,
  ) {
    // Store lists on 'this' context for reuse in the 'Then' validation step.
    this.itemsList = itemsList;
    this.priceList = priceList;
    this.quantitiesList = quantitiesList;

    const shoppingCartPage = this.shoppingCartPage;

    //convert strings into clean arrays.
    const items = itemsNameList(itemsList);
    const prices = itemsNameList(priceList).map(Number);
    const quantities = itemsNameList(quantitiesList).map(Number);

    //loop through each item to add, configure, and verify it.
    for (let i = 0; i < items.length; i++) {
      const itemName = items[i];
      const quantity = quantities[i];
      const expectedPrice = prices[i];

      //add item to the shopping cart.
      await shoppingCartPage.addToCart(itemName);

      //set the requested quantity
      await shoppingCartPage.setNumber(itemName, quantity);

      //target the specific row for validation.
      const itemRow = shoppingCartPage.getCartRow(itemName).first();

      //verify that the input field displays the correct quantity.
      const input = itemRow.locator("input.cart-quantity-input");
      //get the current value of the input field using JavaScript execution.
      const value = await input.evaluate((el: HTMLInputElement) => el.value);

      //verify the input value and itemName matches the expected quantity.
      expect(value, `items: "${itemName}" quantity: ${quantity}`).toBe(
        quantity.toString(),
      );

      //verify that the REMOVE button exists and shows correct text.
      const removeBtn = itemRow.locator(".btn-danger");
      //get the button's text directly from hidden elements.
      const removeText = await removeBtn.evaluate((el: HTMLElement) =>
        el.textContent?.trim(),
      );
      //verify that the button text is exactly "REMOVE"
      expect(removeText, `REMOVE button should exist for "${itemName}"`).toBe(
        "REMOVE",
      );

      //get the item's unit price from the web page as a number.
      const itemPrice = await shoppingCartPage.getItemPrice(itemName);
      //compare price with the expected price up to 2 decimal
      expect(
        itemPrice,
        `Item price of "${itemName}" should be $${expectedPrice}`,
      ).toBeCloseTo(expectedPrice, 2);
    }
  },
);

//Select items to cart//
Then(
  "the user should see {string} in the cart",
  async function (expectedResult) {
    const shoppingCartPage = this.shoppingCartPage;
    //extract the first word from the expected result to get the item name
    const itemKeyword = expectedResult.split(" ")[0];
    //get the specific item row locator using the extracted item name
    const itemRow = shoppingCartPage.getCartRow(itemKeyword);

    //verify pass evaluate because element hidden
    const rowText = await itemRow.evaluate((el: HTMLElement) =>
      el.textContent?.trim(),
    );
    //verify rowText is not null
    expect(rowText).toBeTruthy();

    //verify remove button in row
    const removeText = await itemRow
      .locator(".btn-danger")
      .evaluate((el: HTMLElement) => el.textContent?.trim());
    //verify text on button
    expect(removeText).toBe("REMOVE");
  },
);

//Total Cost for more Items//
Then(
  "the summary total cost should be {string} and {string}",
  async function (itemTotalList: string, summaryTotal: string) {
    const shoppingCartPage = this.shoppingCartPage;

    //convert string inputs into arrays of numbers for calculations
    const items = itemsNameList(this.itemsList as string);
    const prices = itemsNameList(this.priceList as string).map(Number);
    const quantities = itemsNameList(this.quantitiesList as string).map(Number);
    const itemTotals = itemsNameList(itemTotalList).map(Number);
    const expectedSummary = Number(summaryTotal);

    //verify the row total for each item (price × quantity)
    for (let i = 0; i < items.length; i++) {
      // Get the unit price of the current item from the page
      const price = await shoppingCartPage.getItemPrice(items[i]);

      //calculate the total for this row and fix it to 2 decimal places
      const rowTotal = parseFloat((price * quantities[i]).toFixed(2));

      //verify if the calculated row total matches the expected total
      expect(rowTotal).toBeCloseTo(itemTotals[i], 2);
    }

    //verify the grand total displayed on the web page
    //get total price from the shopping cart page
    const grandTotal = await shoppingCartPage.getTotalPrice();

    //verify if the displayed total matches the expected summary total
    expect(grandTotal).toBeCloseTo(expectedSummary, 2);

    //trigger the checkout action on the shopping cart page
    await shoppingCartPage.checkOut();

    await expect(this.page.locator("#shipping-address")).toBeVisible({
      timeout: 5000,
    });
  },
);
