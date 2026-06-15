import { type Locator, type Page } from "@playwright/test";
import { count } from "node:console";
import { it } from "node:test";

export class ShoppingCartPage {
  //declare a variable
  readonly page: Page;
  readonly items: Locator;
  readonly proceedToCheckOutBtn: Locator;
  readonly shippingDetailsPage: Locator;
  readonly totalPrice: Locator;

  //Identify the locator
  constructor(page: Page) {
    this.page = page;
    this.items = page.locator(".shop-item");
    this.proceedToCheckOutBtn = page.locator(".btn-purchase");
    this.shippingDetailsPage = page.locator("#shipping-address");
    this.totalPrice = page.locator(".cart-total");
  }

  //get itemsname
  getItemName(itemName: string) {
    //removes extra spaces and creates a search pattern that ignores CAPITAL letters.
    const regex = new RegExp(itemName.trim(), "i");

    //filters the items that match the search pattern and returns them.
    return this.items.filter({ hasText: regex });
  }

  async addToCart(itemName: string) {
    //find the ADD TO CART button inside the shop item that matches the given item name
    const addBtn = this.page
      .locator(".shop-item")
      .filter({ hasText: itemName })
      .locator("button.shop-item-button");

    //trigger click via dispatchEvent to bypass visibility restrictions
    await addBtn.dispatchEvent("click");

    //wait for the cart row to be attached to the DOM after clicking
    await this.page.waitForSelector(".cart-row", {
      state: "attached",
      timeout: 10000,
    });
  }

  //Trigger Proceed to checkout button
  async checkOut() {
    //click the button directly via JavaScript, bypassing Playwright's visibility checks.
    await this.page.evaluate(() => {
      //find the purchase button on the page.
      const proceedToCheckOutBtn = document.querySelector(
        ".btn-purchase",
      ) as HTMLElement;

      //click the button directly (will throw an error if the button is missing).
      proceedToCheckOutBtn.click();
    });
  }

  //fill number in items
  async setNumber(itemName: string, number: number) {
    //find itemsName in cart row
    const cartRow = this.page
      .locator(".cart-row")
      .filter({ hasText: itemName });

    //find the quantity input field inside the first cart row.
    const input = cartRow.first().locator("input.cart-quantity-input");

    //wait until the input element
    await input.waitFor({ state: "attached" });

    // Set value directly via JavaScript because element input is hidden
    await input.evaluate((el: HTMLInputElement, value) => {
      //set number
      el.value = value;
      //trigger the change event so the page updates its data.
      el.dispatchEvent(new Event("change", { bubbles: true }));

      //pass the number as a string into the function as value.
    }, number.toString());
  }

  //get the price of an item as a number
  async getItemPrice(itemName: string) {
    //find the specific item row and extract its price text
    const priceText = await this.getCartRow(itemName)
      .first() //target the first matching row for this item
      .locator(".cart-price") //locate the price element inside that row
      .first() //ensure we select the first price element
      .innerText(); //extract the visible text

    //strip currency symbols and convert the price to a number
    return parseFloat(priceText.replace(/[^0-9.]/g, ""));
  }

  //get the final total price from the cart as a number
  async getTotalPrice() {
    //find totalText and extract its price text
    const totalText = await this.page.locator(".cart-total-price").innerText();
    //strip currency symbols and convert the price to a number
    return parseFloat(totalText.replace(/[^0-9.]/g, ""));
  }

  //find a specific item row inside the shopping cart.
  getCartRow(itemName: string) {
    //remove extra spaces and create a case-insensitive search pattern.
    const regex = new RegExp(itemName.trim(), "i");

    //filter and return the cart row that matches the item name.
    return this.page.locator(".cart-row").filter({ hasText: regex });
  }
}
