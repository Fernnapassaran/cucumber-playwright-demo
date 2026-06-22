# Cucumber Playwright Demo

QA Automation Framework using Playwright, Cucumber (BDD), TypeScript, and API Testing.

## Tech Stack

- Playwright
- TypeScript
- Cucumber
- Axios / Fetch API
- cucumber-html-reporter
- GitHub Actions
- Docker

---

## Project Structure

```text
CUCUMBER-PLAYWRIGHT-DEMO
│
├── .github
│   └── workflows
│       ├── backend-tests.yml
│       └── cucumber-tests.yml
│
├── data
│   ├── employees.json
│   ├── shippingData.json
│   ├── shoppingCartData.json
│   └── users.json
│
├── features
│   ├── backend
│   │   └── employees.feature
│   │
│   └── frontend
│       ├── login.feature
│       ├── shopping.feature
│       └── shipping.feature
│
├── step_definitions
│   ├── backend
│   │   └── employee.steps.ts
│   │
│   ├── frontend
│   │   ├── login.steps.ts
│   │   ├── shopping.cart.steps.ts
│   │   └── shipping.details.steps.ts
│   │
│   └── support
│       ├── auth.setup.ts
│       ├── browserSetup.ts
│       └── timeout.ts
│
├── pages
│   ├── LoginPage.ts
│   ├── ShoppingCartPage.ts
│   └── ShippingDetailsPage.ts
│
├── reports
│   ├── cucumber_report.json
│   └── report.html
│
└── package.json
```

---

## Assignment Coverage

### UI Testing

#### Step 1 - Login Shop

Positive Test Cases

- Login with valid username/password
- Navigate to shopping page successfully

Negative Test Cases

- Invalid username
- Invalid password
- Empty username
- Empty password
- Empty credentials

Feature File

```gherkin
features/frontend/login.feature
```

#### Step 2 - Shopping Cart

Selected Products

| Product            | Qty |
| ------------------ | --- |
| Dior J'adore       | 2   |
| Gucci Bloom Eau de | 3   |

Validation

- Verify quantity
- Verify item total
- Verify cart summary total
- Verify Proceed To Checkout button

Feature File

```gherkin
features/frontend/shopping.feature
```

#### Step 3 - Shipping Details

Positive

- Fill all mandatory fields
- Submit Order successfully

Negative

- Missing required fields
- Cannot submit order

Feature File

```gherkin
features/frontend/shipping.feature
```

#### Step 4 - Order Summary

Validate Address Format

```text
Street, City - Country
```

Example

```text
Sukhumvit Road, Bangkok - Thailand
```

Validation

- Address displayed correctly
- Data matches checkout information

---

## End-to-End Scenario

```text
Login
→ Select Products
→ Verify Cart Total
→ Checkout
→ Submit Order
→ Verify Order Summary
```

---

## API Testing

### POST /api/v1/employees

Positive

Verify

```text
Response Status = 201
```

Negative

Invalid Email Format

Verify

```text
Response Status = 400
```

Validate

```json
{
  "defaultMessage": "must be a well-formed email address"
}
```

### GET /api/v1/employees/{id}

Positive

Existing Employee ID

Verify

```text
Response Status = 200
```

Negative

Non-existing Employee ID

Verify

```text
Response Status = 404
```

Response

```json
{
  "message": "Employee not found with ID {id}"
}
```

---

## Setup

Install dependencies

```bash
npm install
```

Install Playwright

```bash
npx playwright install
```

---

## Run Backend API

Start Docker container

```bash
docker run -d --rm --name qa-practice-api -p 8887:8081 rvancea/qa-practice-api:latest
```

Swagger

```text
http://localhost:8887/swagger-ui.html#/
```

---

## Run Tests

Frontend

```bash
npm run test:ui
```

Backend

```bash
npm run test:api
```

All Tests

```bash
npm test
```

---

## Generate Report

```bash
node generate-report.js
```

Output

```text
reports/report.html
```

Report includes

- Passed Scenarios
- Failed Scenarios
- Step Execution
- Duration
- Error Details
- Screenshots (if enabled)

---

## GitHub Actions

Automated pipelines

### UI Pipeline

```text
.github/workflows/cucumber-tests.yml
```

### API Pipeline

```text
.github/workflows/backend-tests.yml
```

Features

- Install dependencies
- Run Playwright Tests
- Run API Tests
- Generate Reports
- Upload Artifacts

---

## Design Pattern

- Page Object Model (POM)
- BDD (Cucumber)
- Test Data Driven
- Reusable Step Definitions
- CI/CD Integration
