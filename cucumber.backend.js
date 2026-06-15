module.exports = {
  default: {
    // Define the locations of the feature files
    paths: ["features/backend/**/*.feature"],

    // Define the locations of the step definitions inside the features directory
    require: ["features/step_definitions/backend/**/*.ts"],

    // Use ts-node to transpile TypeScript to JavaScript on the fly
    requireModule: ["ts-node/register"],

    // Define the output format for test reports
    format: [
      "progress", // Display execution progress in the terminal
      "json:reports/backend-report.json", // Save test results as a JSON report
    ],
  },
};
