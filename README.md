# Data Verification and Data IO Extension App Reference Implementation

## Introduction
This reference implementation implements the data verification and [data IO](https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/data-io/) extensions.

These data verification extensions are used:

- [Email address verification](https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/email-address-verification/)
- [Phone verification](https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/phone-verification/)
- [SSN verification](https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/ssn-verification/)
- [Postal address verification](https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/postal-address-verification/)

## Authentication
This reference implementation supports two [authentication](https://developers.docusign.com/extension-apps/build-an-extension-app/it-infrastructure/authorization/) flows:
* [Authorization Code Grant](https://developers.docusign.com/extension-apps/build-an-extension-app/it-infrastructure/authorization/#authorization-code-grant) – required for public extension apps
* [Client Credentials Grant](https://developers.docusign.com/extension-apps/build-an-extension-app/it-infrastructure/authorization/#client-credentials-grant) – available to private extension apps. See [Choosing private distribution instead of public](https://developers.docusign.com/extension-apps/extension-apps-101/choosing-private-distribution/).

*Private extension apps can use either authentication method, but public extension apps must use Authorization Code Grant.*

## Hosted version (no setup required)
You can use the hosted version of this reference implementation by directly uploading the appropriate manifest file located in the [manifests/hosted/](manifests/hosted) folder to the Docusign Developer Console. See [Upload your manifest](#3-upload-your-manifest).

**Note:** The provided manifest includes `clientId` and `clientSecret` values used in the sample authentication connection. These do not authenticate to a real system, but the hosted reference implementation requires these exact values.

## Choose your setup: local or cloud deployment
If you want to run the app locally using Node.js and ngrok, follow the [Local setup instructions](#local-setup-instructions) below.

If you want to deploy the app to the cloud using Docker and Terraform, see [Deploying an extension app to the cloud with Terraform](terraform/README.md). This includes cloud-specific setup instructions for the following cloud providers:
- [Amazon Web Services](https://aws.amazon.com/)
- [Microsoft Azure](https://azure.microsoft.com/)
- [Google Cloud Platform](https://cloud.google.com/)

## Local setup instructions

### 1. Clone the repository
Run the following command to clone the repository:

```bash
git clone https://github.com/docusign/extension-app-data-io-and-verification-reference-implementation.git
```

### 2. [Install and configure Node.js and npm on your machine.](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### 3. Generate secret values
If you already have values for `JWT_SECRET_KEY`, `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET`, and `AUTHORIZATION_CODE`, you may skip this step.

The easiest way to generate a secret value is to run the following command:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'));"
```

You will need values for `JWT_SECRET_KEY`, `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET`, and `AUTHORIZATION_CODE`.

### 4. Set the environment variables for the cloned repository
- If you're running this in a development environment, create a copy of `example.development.env` and save it as `development.env`.
- If you're running this in a production environment, create a copy of `example.production.env` and save it as `production.env`.
- Replace `JWT_SECRET_KEY`, `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET`, and `AUTHORIZATION_CODE` in `development.env` or `production.env` with your generated values. These values will be used to configure the sample proxy's mock authentication server.

### 5. Install dependencies
Run the following command to install the necessary dependencies:

```bash
npm install
```

### 6. Running the proxy server
#### Development mode:
Start the proxy server in development mode by running

```bash
npm run dev
```

This will create a local server on the port in the `development.env` file (port 3000 by default) that listens for local changes that trigger a rebuild.

#### Production mode:
Start the proxy server in production mode by running
```bash
npm run build
npm run start
```

This will start a production build on the port in the `production.env` file (port 3000 by default).

## Set up ngrok
### 1. [Install and configure ngrok for your machine.](https://ngrok.com/docs/getting-started/)
### 2. Start ngrok
Run the following command to create a publicly accessible tunnel to your localhost:

```bash
ngrok http <PORT>
```

Replace `<PORT>` with the port number in the `development.env` or `production.env` file.

### 3. Save the forwarding address
Copy the `Forwarding` address from the response. You’ll need this address in your `manifest.json` file.

```bash
ngrok

Send your ngrok traffic logs to Datadog: https://ngrok.com/blog-post/datadog-log

Session Status                online
Account                       email@domain.com (Plan: Free)
Update                        update available (version 3.3.1, Ctrl-U to update)
Version                       3.3.0
Region                        United States (us)
Latency                       60ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://bbd7-12-202-171-35.ngrok-free.app -> http:

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

In this example, the `Forwarding` address to copy is `https://bbd7-12-202-171-35.ngrok-free.app`.

## Create an extension app
### 1. Prepare your app manifest
Choose a manifest from the [manifests](manifests/) folder based on the appropriate [authentication](#authentication) use case. Replace `<PROXY_BASE_URL>` in your manifest.json file with the ngrok forwarding address in the following sections:
- `connections.params.customConfig.tokenUrl`
- `connections.params.customConfig.authorizationUrl`
- `actions.params.uri`

Update the following variables in your manifest.json file with the corresponding environment variables:
- Set the `clientId` value in your manifest.json file to the same value as `OAUTH_CLIENT_ID`.
- Set the `clientSecret` value in your manifest.json file to the same value as `OAUTH_CLIENT_SECRET`.

### 2. Navigate to the Docusign [Developer Console](https://devconsole.docusign.com/)
Log in with your Docusign developer credentials.

### 3. Upload your manifest
Register your extension app by [uploading your app manifest](https://developers.docusign.com/extension-apps/build-an-extension-app/register/use-manifest/).

## Test the extension app

[Test your extension app](https://developers.docusign.com/extension-apps/build-an-extension-app/test/). Extension app tests include [integration tests](https://developers.docusign.com/extension-apps/build-an-extension-app/test/integration-tests/) (connection tests and extension tests), [functional tests](https://developers.docusign.com/extension-apps/build-an-extension-app/test/functional-tests/), and [App Center preview](https://developers.docusign.com/extension-apps/build-an-extension-app/test/app-center-preview/).

### **Data verification**
For the data verification extensions, this implementation uses mock data to simulate how data can be verified. [Test your extension](https://developers.docusign.com/extension-apps/build-an-extension-app/test/) using the sample data in the [database folder](src/db/).

Request bodies much match the appropriate [action contract](https://developers.docusign.com/extension-apps/extension-app-reference/app-manifest-reference/action/):
- [Email address verification](https://developers.docusign.com/extension-apps/extension-app-reference/action-contracts/email-address-verification/#request) example JSON request body:
  ```
  {
    "email": "s.johnson@techcorp.com"
  }
  ```
- [Phone verification](https://developers.docusign.com/extension-apps/extension-app-reference/action-contracts/phone-verification/#request) example JSON request body:
  ```
  {
    "phoneNumber": "12345678901",
    "region": "1"
  }
  ```
- [SSN verification](https://developers.docusign.com/extension-apps/extension-app-reference/action-contracts/ssn-verification/#request) example JSON request body:

  ```
  {
    "socialSecurityNumber": "123-45-6789",
    "firstName": "Eliza",
    "lastName": "Monroe",
    "dateOfBirth": "2015-10-09"
  }
  ```

- [Postal address verification](https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/postal-address-verification#request/) The postal address data verification extension contract requires two actions:

  - `Verify.Version1.PostalAddress`: This action will return the verified address with a successful response if the request body exactly matches an entry in the sample database.

    Example JSON request body:

    ```
    {
      "street1": "123 Main St",
      "street2": "Apt 4B",
      "locality": "Springfield",
      "subdivision": "IL",
      "countryOrRegion": "US",
      "postalCode": "62701"
    }

    ```

    **Note:** "street2" is an optional parameter.

  - `Typeahead.Version1.PostalAddress`: This action will return a list of suggested addresses if the sample database contains one or more partial matches to the request body.

    Example JSON request body:

    ```
    {
      "street1": "123 Main St",
      "street2": "Apt 4B",
      "locality": "Springfield",
      "subdivision": "IL",
      "countryOrRegion": "US",
      "postalCode": "62701"
    }

    ```
     **Note:** "street2" is an optional parameter.


    Example JSON response:

    ```
    {
      "suggestions": [{
        "street1": "123 Main St",
        "street2": "Apt 4B",
        "locality": "Springfield",
        "subdivision": "IL",
        "countryOrRegion": "US",
        "postalCode": "62701"
      }]
    }
    ```

### **Data IO**
**Note:** These instructions only apply if you use the [mock data](src/db/) in the reference implementation. If you use your own database, you’ll need to construct your requests based on your own schema. Queries for extension tests in the Developer Console are built using [IQuery](https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/custom-query-language/) structure.


#### CreateRecord extension test
To begin the extension test process, run the CreateRecord test using the sample request body below. The test should return a response containing the record ID.

```json
{
  "typeName": "Account",
  "idempotencyKey": "NOT_USED_CURRENTLY",
  "data": {
    "Name": "Test Account",
    "ShippingLatitude": 10,
    "PushCount": 6
  }
}
```

All record types are located in the `/src/db/` folder of this repository.

Open the `Account.json` file in the `/src/db/` folder and check that the records were created.

#### SearchRecords extension test
This query searches the records that have been created. You don’t have to use the same sample values used here; the search should work with a valid attribute in `Account.json`.

Open the SearchRecords test and create a new query based on the `Account.json` file:

- The `from` attribute maps to the value of `typeName` in the CreateRecord request body; in this case, `Account`.
- The `data` array from the CreateRecord query maps to the `attributesToSelect` array; in this case, `Name`.
- The `name` property of the `leftOperand` object should be the value of `Name`; in this case, `Test Account`.
- The `operator` value should be `EQUALS`.
- The `name` property of the `rightOperand` object should be the same as what's in `attributesToSelect` array; in this case, `Name`.

The query below has been updated based on the directions above. You can copy and paste this into the SearchRecords test input box.

```json
{
    "query": {
        "$class": "com.docusign.connected.data.queries@1.0.0.Query",
        "attributesToSelect": [
            "Name"
        ],
        "from": "Account",
        "queryFilter": {
            "$class": "com.docusign.connected.data.queries@1.0.0.QueryFilter",
            "operation": {
                "$class": "com.docusign.connected.data.queries@1.0.0.ComparisonOperation",
                "leftOperand": {
                    "$class": "com.docusign.connected.data.queries@1.0.0.Operand",
                    "name": "Test Account",
                    "type": "STRING",
                    "isLiteral": true
                },
                "operator": "EQUALS",
                "rightOperand": {
                    "$class": "com.docusign.connected.data.queries@1.0.0.Operand",
                    "name": "Name",
                    "type": "INTEGER",
                    "isLiteral": false
                }
            }
        }
    },
    "pagination": {
        "limit": 10,
        "skip": 10
    }
}
```

Running the test will return the record you queried.

#### PatchRecord extension test
The `recordId` property in the sample input maps to an `Id` in the `Account.json` file. Any valid record ID can be used in this field.

In the `data` array, include any attributes and values to be added to the record. In this request, a new property will be added, and the original data in the record will be updated.

```bash
{
  "recordId": "2",
  "typeName": "Account",
  "idempotencyKey": "NOT_USED_CURRENTLY",
  "data": {
    "Name": "updatedTestAccount",
    "ShippingLatitude": 11,
    "PushCount": 7,
    "MasterRecordId": "ABCD"
  }
}
```

Running the test should return the response `"success": true`.

Rerun the SearchRecords extension test to search for the new patched values.

**Input query:**
```json
{
    "query": {
        "$class": "com.docusign.connected.data.queries@1.0.0.Query",
        "attributesToSelect": [
            "Name"
        ],
        "from": "Account",
        "queryFilter": {
            "$class": "com.docusign.connected.data.queries@1.0.0.QueryFilter",
            "operation": {
                "$class": "com.docusign.connected.data.queries@1.0.0.ComparisonOperation",
                "leftOperand": {
                    "$class": "com.docusign.connected.data.queries@1.0.0.Operand",
                    "name": "updatedTestAccount",
                    "type": "STRING",
                    "isLiteral": true
                },
                "operator": "EQUALS",
                "rightOperand": {
                    "$class": "com.docusign.connected.data.queries@1.0.0.Operand",
                    "name": "Name",
                    "type": "INTEGER",
                    "isLiteral": false
                }
            }
        }
    },
    "pagination": {
        "limit": 10,
        "skip": 10
    }
}
```

**Results:**

![Results of SearchRecords after PatchRecord](https://github.com/user-attachments/assets/70dbce23-0c9d-4150-ab25-c853e92d695f)


The `Account.json` file will contain the updated records.

![Account.json after PatchRecord test](https://github.com/user-attachments/assets/ace8276b-2d36-4171-a598-2450e6d9b5fe)
