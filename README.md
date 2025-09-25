# EDIIG Test Automation Framework

## Overview
This project is an automated testing framework for the EDIIG platform using Playwright with TypeScript. It implements the Page Object Model (POM) design pattern for maintainable and scalable test automation.

## Project Structure
```
ediig-test/
├── config/
│   └── testConfig.ts         # Test configuration and environment variables
├── pages/
│   ├── LoginPage.ts         # Login page object
│   ├── AuctionPage.ts       # Auction page object
│   └── RegistrationPage.ts  # Registration page object
├── tests/
│   ├── login.spec.ts        # Login tests
│   ├── registration.spec.ts # Registration tests
│   └── bid.spec.ts         # Bidding tests
├── Screenshots/             # Test execution screenshots
├── reports/
│   ├── html-report/        # HTML test reports
│   └── allure-results/     # Allure test reports
├── playwright.config.ts     # Playwright configuration
└── package.json            # Project dependencies and scripts
```

## Features
- **Page Object Model**: Separates test logic from page interactions
- **Screenshot Capture**: Automatic screenshots on test failure
- **Reporting**: HTML and Allure reporting
- **Error Handling**: Comprehensive error handling and logging
- **Retry Mechanism**: Automatic retry for failed actions
- **Type Safety**: Full TypeScript implementation

## Test Scenarios
1. **Login Tests**
   - Successful login with valid credentials
   - Parallel login for two users

2. **Registration Tests**
   - Complete registration process
   - Form validation
   - Error handling

3. **Auction/Bidding Tests**
   - Place bids on vehicles
   - Validate bid status updates
   - Handle bid amount calculations
   - Verify winning status

## Setup and Installation

1. **Prerequisites**
   ```bash
   Node.js (v14 or higher)
   npm (v6 or higher)
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright Browsers**
   ```bash
   npx playwright install
   ```

## Running Tests

1. **Run All Tests**
   ```bash
   npx playwright test
   ```

2. **Run Specific Test File**
   ```bash
   npx playwright test tests/login.spec.ts
   ```

3. **Run in Debug Mode**
   ```bash
   npx playwright test --debug
   ```

4. **Run in Headed Mode**
   ```bash
   npx playwright test --headed
   ```

## Test Configuration

Configuration settings are stored in `config/testConfig.ts`:

```typescript
export const testConfig = {
    baseURL: "https://qa.ediig.com/",
    credentials: {
        username1: "testuser",
        password1: "Test@1234"
    },
    timeout: 60000
};
```

## Page Objects

### LoginPage
- Handles user authentication
- Validates login success/failure
- Manages navigation after login

### AuctionPage
- Manages auction item selection
- Handles bidding process
- Validates bid status updates
- Tracks vehicle registration numbers

### RegistrationPage
- Handles user registration flow
- Validates form inputs
- Manages document uploads

## Test Reports

1. **HTML Reports**
   ```bash
   npx playwright show-report reports/html-report
   ```

2. **Allure Reports**
   ```bash
   npx allure serve reports/allure-results
   ```

## Best Practices

1. **Page Objects**
   - Keep selectors in page objects
   - Use meaningful method names
   - Implement proper error handling
   - Add JSDoc comments for methods

2. **Tests**
   - One assertion per test
   - Clear test descriptions
   - Proper test isolation
   - Handle test data properly

3. **Error Handling**
   - Use try-catch blocks
   - Implement proper logging
   - Take screenshots on failures
   - Add meaningful error messages

## Common Issues and Solutions

1. **Test Stability**
   - Use proper waits and timeouts
   - Implement retry mechanisms
   - Handle dynamic content properly

2. **Performance**
   - Run tests in parallel when possible
   - Optimize selector strategies
   - Use proper test isolation

3. **Maintenance**
   - Keep selectors updated
   - Regular code reviews
   - Maintain test data separately
   - Regular framework updates

## Contributing

1. Follow TypeScript best practices
2. Add proper documentation
3. Maintain test isolation
4. Add meaningful commit messages

