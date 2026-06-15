const reporter = require("cucumber-html-reporter");

const options = {
  theme: "bootstrap",
  jsonFile: "reports/backend-report.json",
  output: "reports/report.html",
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: false,
  metadata: {
    "Project Name": "QA Practice API",
    "API Base URL": "http://localhost:8887",
    "Test Type": "Backend API",
    "Executed By": "GitHub Actions",
  },
};

reporter.generate(options);
console.log("Report generated at: reports/report.html");
