Feature: User input shipping Details

  Background:
    Given the user is logged in
    And the user has items in the cart
    And the user has proceeded to checkout

  @shipping
  # Positive Test Case
  Scenario: User submits order with all required fields and validates address
    When the user fills in shipping details from positive data
    Then the user should be able to submit the order successfully
    And the address should be displayed correctly

  # Negative Test Cases
  Scenario: User submits order with missing required fields
    When the user fills in shipping details from negative data
    Then the user should not be able to submit the order