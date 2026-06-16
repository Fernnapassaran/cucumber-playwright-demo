Feature: User shopping Cart

@shopping
Scenario Outline: Select items to cart
    Given the user is on the shopping cart page
    When the user add items "<itemsName>" and quantity "<quantity>"
    Then the user should see "<expectedResult>" in the cart

    Examples:
      | itemsName               | quantity  | expectedResult                        |
      | Dior J'adore            | 2         | Dior J'adore add 2 unit Success       |
      | Gucci Bloom Eau de      | 3         | Gucci Bloom Eau de add 3 unit Success |

Scenario Outline: Total Cost for more Items
    Given the user is on the shopping cart page
    When the user add more items "<itemsList>" with price "<priceList>" and quantity "<quantitiesList>"
    Then the summary total cost should be "<itemTotalList>" and "<summaryTotal>"

    Examples:
      | itemsList                         | priceList          | quantitiesList | itemTotalList      | summaryTotal |
      | Dior J'adore, Gucci Bloom Eau de  | 89.99, 79.99       | 2, 3           | 179.98, 239.97     | 419.95       |