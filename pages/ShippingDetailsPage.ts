import { type Locator, type Page } from "@playwright/test";

export class ShippingDetailsPage {
  //declare a variable
  readonly page: Page;
  readonly phonenumberInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly countrySelector: Locator;
  readonly submitOrderBtn: Locator;

  //Identify the locator
  constructor(page: Page) {
    this.page = page;
    this.phonenumberInput = page.locator("#phone");
    this.streetInput = page.locator('[name="street"]');
    this.cityInput = page.locator('[name="city"]');
    this.countrySelector = page.locator("#countries_dropdown_menu");
    this.submitOrderBtn = page.locator("#submitOrderBtn");
  }

  //action

  //Step1
  async ShippingDetails(
    phonenumberInput: string,
    streetInput: string,
    cityInput: string,
    countrySelector: string,
  ) {
    await this.phonenumberInput.fill(phonenumberInput);
    await this.streetInput.fill(streetInput);
    await this.cityInput.fill(cityInput);

    //verify value in countrySelector
    if (countrySelector) {
      await this.countrySelector.selectOption({ label: countrySelector });
    }
    await this.submitOrderBtn.click();
  }
}
