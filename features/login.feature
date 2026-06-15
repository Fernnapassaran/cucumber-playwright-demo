Feature: User Login

  @login
  Scenario: Login with valid  credentials
    Given the user is on the login page
    When the user logs in with username "admin@admin.com" and password "admin123"
    Then the user should see a shopping cart page

  @login
  Scenario Outline: Login with invalid credentials
    Given the user is on the login page
    When the user logs in with username "<username>" and password "<password>"
    Then the user should see "<expectedResult>"

    Examples:
      | username        | password  | expectedResult |
      | wrong@email.com | wrongpass | Bad credentials! Please try again! Make sure that you've registered. |
