# Cypress Framework With Example Tests and Microsoft Teams Notification Functionality
## By **Rohit Shinde** | [LinkedIn](https://www.linkedin.com/in/rohit-shinde-498a05a7/) 
---
## Description:

Using Cypress, we will create a test automation framework with example tests Test Reports being sent to your Microsoft Teams Channel.

## 🚀 Lets get started...

## 🟩 PART 1️⃣

## 1. Clone this code 
## 2. Install all the dependencies 

```
npm init -y
npm install
npx cypress open
```

## 3. Configure the environment variables
In cypress.config.js we used two environment variables as shown below

```
env: {
  SEND_MS_TEAMS_NOTIFICATIONS: true,
  MS_TEAMS_WEBHOOK_URL: ""
}
```

We need to set `SEND_MS_TEAMS_NOTIFICATIONS` to true or false based on if you want to send teams notifications or not.
Second environment varaible we used `MS_TEAMS_WEBHOOK_URL` should have webhook url to your microsoft teams channel
You can follow the guide [here](https://learn.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook?tabs=dotnet) to create the webhook to you teams channel.

## 4. Run the tests
Using below command you can run the tests and can get the test results in your teams channel.

```
npx cypress run --spec cypress/e2e/1-getting-started/todo.cy.js
```

You can add or use scripts already saved in package.json or can also run the tests through CI jobs and get the results in teams channel as long you have `SEND_MS_TEAMS_NOTIFICATIONS` set to true.

## 5. Teams channel screenshots

Result with passed and failed tests.

<img width="996" alt="Screenshot 2023-08-29 at 3 03 17 PM" src="https://github.com/rsrohit/CypressTeamsNotifications/assets/16362340/4013dd6a-04d1-4644-93ef-7daf680fb457">

Result with all passed tests.

<img width="996" alt="Screenshot 2023-08-29 at 3 08 18 PM" src="https://github.com/rsrohit/CypressTeamsNotifications/assets/16362340/427a5ac1-e071-4dcd-8f32-b6a0092a1fbd">

## Note 

- This functionality of sending teams notfications with test results is built using cypress-plugin method.
- With new version of cypress we can write the plugins directly in `cypress.config.js` file, however to keep the file clean following old way I wrote the plugin functions in `*cypress\plugins\index.js` file.
- To add custom image to you webhook messages as you can see in screenshot, you can add it while creating the webhook or later once created also. You can download cypress logos from google.
