const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "92gf8q",
  e2e: {
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config);
    },
    baseUrl: "https://example.cypress.io/todo",
  },
  env: {
    SEND_MS_TEAMS_NOTIFICATIONS: true,
    MS_TEAMS_WEBHOOK_URL: ""
  },
});