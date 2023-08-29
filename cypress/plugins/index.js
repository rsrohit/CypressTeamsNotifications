/// <reference types="cypress" />
// ***********************************************************
// This example /index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

require('dotenv').config();
const axios = require('axios');
const dotenvPlugin = require('cypress-dotenv');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  on('after:run', async (results) => {
    //console.log("result - " + JSON.stringify(results))
    try {
      if (!results) {
        console.log("The results object was not yielded after the run API.");
        return;
      }
      
      if (config.env.SEND_MS_TEAMS_NOTIFICATIONS === true) {
        const failedTests = listFailedTestCases(results.runs);
        const baseUrl = results.config.baseUrl;
        const totalFailed = results.totalFailed;
        const totalTests = results.totalTests;
        
        let title, colorCode, message;
        if (totalFailed > 0) {
          title = `<h1><strong>${totalFailed} out of ${totalTests} tests have <em style="color:red">FAILED</em> against ${baseUrl}.<br/></strong></h1>`;
          colorCode = 'FF0000';
        } else {
          title = `<h1><strong>All tests have <em style="color:green">PASSED</em> against ${baseUrl}.<br/></strong></h1>`;
          colorCode = '008000';
        }
        
        const message1 = `<h2><strong>Test Report Summary</strong></h2><br/>`;
        message = message1 + generateReport(results) + failedTests;
        
        await postMessageToTeams(title, message, colorCode, config.env.MS_TEAMS_WEBHOOK_URL);
      }
    } catch (err) {
      console.log("There was an error with sending the MS Teams message. Error: " + err);
    }
  });
  
  // For using env vars in Cypress tests
  config = dotenvPlugin(config)
  return config
}

//funation to pull the failed testscase names
function listFailedTestCases(runs) {
  const failedTestCases = runs.flatMap(run =>
    run.tests.filter(test => test.state === 'failed')
  )

  if (failedTestCases.length === 0) {
    return '' // No failed test cases
  }

  const formattedFailures = failedTestCases.map((test, index) =>
    `<br/><h1><strong>FAILED TESTS:</strong></h1><br/><h2><strong>${index + 1}. ${test.title}</strong></h2>` +
    `<br/><pre><code><strong>Error:</strong> ${test.displayError}</code></pre>`
  )

  return formattedFailures.join('')
}

async function postMessageToTeams(title, message, colorCode, url) {
    let response;
    // Send POST request to Webhook
    try {
      // Configure card    
      let card = {
        "@type": "MessageCard",
        "@context":"http://schema.org/extensions",
        "themeColor": `${colorCode}`,
        "summary": "Test Run Results",
        "sections": [
          {
            "activityTitle": `${title}`,
            "text": `${message}`
          }
        ]
      };
      // Turn the card into json
      card = JSON.stringify(card);
      //console.log("Sending MS Teams Report for: " + title);
      //console.log("MS Teams webhook url: " + url);
      response = await axios.post(url, card, {
        headers: {
          'content-type': 'application/vnd.microsoft.teams.card.o365connector',
          'content-length': `${card.toString().length}`,
        },
      });
      if (response.status === 200) { console.log("Teams notification sent successfully.") }
    } catch (err) {
        console.log("Failed to send notification to MS Teams. " + err);
        return err;
    } 
    // finally {
    //   console.log(response);
    // }
}

// Function to generate the overall report
function generateReport(testData) {
  const testResults = testData.runs[0].tests;
  const testResultRows = testResults.map((test, index) => generateTestResultRow(index, test)).join('');

  return `
        <body>
          <table id="summary">
            <thead>
              <tr>
                <th><strong>Total Tests</strong></th>
                <th><strong>Passed</strong></th>
                <th><strong>Failed</strong></th>
                <th><strong>Pending</strong></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${testData.totalTests}</td>
                <td>${testData.totalPassed}</td>
                <td>${testData.totalFailed}</td>
                <td>${testData.totalPending}</td>
              </tr>
            </tbody>
          </table><br>
          <table id="report">
              <thead>
                  <tr>
                      <th>Sr No</th>
                      <th><strong>Test Title</strong></th>
                      <th><strong>Status</strong></th>
                  </tr>
              </thead>
              <tbody>
                  ${testResultRows}
              </tbody>
          </table>
        </body>
      `;
}

// Function to generate a single test result entry in the table
function generateTestResultRow(index, test) {
  const title = test.title.join(' - ');
  const stateClass = test.state === 'passed' ? 'passed' : 'failed';
  const state = test.state === 'passed' ? '<span style="color:green">Passed</span>' : '<span style="color:red">Failed</span>';

  return `
      <tr class="test-row ${stateClass}">
          <td>${index + 1}</td>
          <td>${title}</td>
          <td>${state}</td>
      </tr>
  `;
}