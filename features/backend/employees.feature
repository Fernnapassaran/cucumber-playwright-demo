Feature: Employee API

  Background:
    Given the base URL is "http://localhost:8887"

  #/api/v1/employees
  # Positive Test Case
  Scenario: Create employee with valid data should return 201
    When the user sends POST request to "/api/v1/employees" with data from "positive.createEmployee"
    Then the response status code should be 201

  # Negative Test Case
  Scenario: Create employee with invalid email should return 400 and validate defaultMessage
    When the user sends POST request to "/api/v1/employees" with data from "negative.createEmployeeInvalidEmail"
    Then the response status code should be 400
    And the response errors defaultMessage should be "must be a well-formed email address"

  #/api/v1/employees/{id}
  # Positive Test Case
  Scenario: Get employee by existing id should return 200
    When the user sends GET request to "/api/v1/employees/1"
    Then the response status code should be 200

  # Negative Test Case
  Scenario: Get employee by non-existing id should return 404 and validate message
    When the user sends GET request to "/api/v1/employees/9999"
    Then the response status code should be 404
    And the response body message should be "Employee not found with ID 9999"