import { Given, When, Then } from "@cucumber/cucumber";
import axios, { AxiosResponse } from "axios";
import assert from "assert";
import testData from "../../../data/employees.json";

//variables to store the base URL and the API response
let baseURL: string;
let response: AxiosResponse;

function getTestData(keyPath: string): any {
  // Split the string by dots into an array of keys, then loop through them
  return keyPath.split(".").reduce((obj: any, key) => {
    // Look inside the current object using the current key
    return obj[key];
  }, testData); // Start the loop using the main 'testData' object
}

//Background:
//set base URL backend for API requests
Given("the base URL is {string}", function (url: string) {
  //save the URL into the 'baseURL' variable to use in other steps
  baseURL = url;
});

///api/v1/employees///
When(
  "the user sends POST request to {string} with data from {string}",
  async function (endpoint: string, keyPath: string) {
    //get the test data (payload) from the file using keyPath
    const payload = getTestData(keyPath);
    try {
      //send the POST request with the data payload to the API
      response = await axios.post(`${baseURL}${endpoint}`, payload);
    } catch (error: any) {
      //save the error response if the request fails
      response = error.response;
    }
  },
);

//api/v1/employees/{id}//
// Send GET request with id from endpoint
When(
  "the user sends GET request to {string}",
  async function (endpoint: string) {
    try {
      //get to fetch data
      response = await axios.get(`${baseURL}${endpoint}`);
    } catch (error: any) {
      //if the API returns an error, save it so the test can check it later
      response = error.response;
    }
  },
);

//verify status code all Scenario
Then(
  "the response status code should be {int}",
  function (expectedStatus: number) {
    //verify API response status with the expected status code
    assert.strictEqual(response.status, expectedStatus);
  },
);

//get 404 response only (non-existing id)
Then(
  "the response body message should be {string}",
  function (expectedMessage: string) {
    // Compare the actual text returned from the API with our expected message
    assert.strictEqual(response.data, expectedMessage);
  },
);

//get 400 response only (InvalidEmail)
// Validate defaultMessage in response errors array
Then(
  "the response errors defaultMessage should be {string}",
  function (expectedMessage: string) {
    //scan for the error message in the list (use [] if list is missing)
    const found = (response.data.errors || []).some(
      (err: any) => err.defaultMessage === expectedMessage,
    );
    //pass if found, fail if not found
    assert.ok(found, `defaultMessage "${expectedMessage}" not found`);
  },
);
