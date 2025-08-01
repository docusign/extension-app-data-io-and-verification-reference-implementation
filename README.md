# Data verification, Connected fields and Data IO Extension App Reference Implementation

## Introduction

This reference implementation models consists of the data verification, connected fields and data io features.

The data verification part consists of seven use cases:

- [Bank account owner verification](https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/bank-account-owner-verification/)
- [Bank account verification](https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/bank-account-verification/)
- [Business FEIN verification](https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/business-fein-verification/)
- [Email address verification](https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/email-address-verification/)
- [Phone verification](https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/phone-verification/)
- [SSN verification](https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/ssn-verification/)
- [Postal address verification](https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/postal-address-verification/)
- [Connected fields](https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/connected-fields/)
- [Data IO](https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/data-io/)

Each use case corresponds to a separate extension in the [manifest.json](/manifest.json) file of this repository.

## Video Walkthrough

[![Reference implementation videos](https://img.youtube.com/vi/_4p7GWK5aoA/0.jpg)](https://youtube.com/playlist?list=PLXpRTgmbu4or5pJIFg6h1bg1Gt4wZTYbT&feature=shared)

## Setup instructions

### 1. Clone the repository

Run the following command to clone the repository:

```bash
git clone https://github.com/docusign/extension-app-data-io-and-verification-reference-implementation.git
```

### 2. [Install and configure Node.js and npm on your machine.](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### 3. Generate secret values

- If you already have values for `JWT_SECRET_KEY`, `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET`, and `AUTHORIZATION_CODE`, you may skip this step.

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

Start the proxy server in development mode by running the command:

```bash
npm run dev
```

This will create a local server on the port in the `development.env` file (port 3000 by default) that listens for local changes that trigger a rebuild.

#### Production mode:

Start the proxy server in production mode by running
npm run build
npm run start

This will start a production build on the port in the `production.env` file (port 3000 by default).

## Setting up ngrok

### 1. [Install and configure ngrok for your machine.](https://ngrok.com/docs/getting-started/)

### 2. Start ngrok

Run the following command to create a public accessible tunnel to your localhost:

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

Replace `<PROXY_BASE_URL>` in your manifest.json file with the ngrok forwarding address in the following sections:

- `connections.params.customConfig.tokenUrl`
- `connections.params.customConfig.authorizationUrl`
- `actions.params.uri`

Update the following variables in your manifest.json file with the corresponding environment variables:

- Set the `clientId` value in your .manifest.json file to the same value as `OAUTH_CLIENT_ID`.
- Set the `clientSecret` value in your .manifest.json file to the same value as `OAUTH_CLIENT_SECRET`.

### 2. Navigate to the Docusign [Developer Console](https://devconsole.docusign.com/)

Log in with your Docusign developer credentials and create a new app.

### 3. Upload your manifest and create the extension app

[Create your extension app](https://developers.docusign.com/extension-apps/build-an-extension-app/create/)

## Test the extension app

[Test your extension](https://developers.docusign.com/extension-apps/build-an-extension-app/test/). Extension app tests include [integration tests](https://developers.docusign.com/extension-apps/build-an-extension-app/test/integration-tests/) (connection tests and extension tests), [functional tests](https://developers.docusign.com/extension-apps/build-an-extension-app/test/functional-tests/), and [App Center preview](https://developers.docusign.com/extension-apps/build-an-extension-app/test/app-center-preview/).

### **Data verification**

For the data verification, this implementation uses mock data to simulate how data can be verified against a database. [Test your extension](https://developers.docusign.com/extension-apps/build-an-extension-app/test/) using the sample data in [sampleData.ts](src/constants/sampleData.ts).

Request bodies much match the appropriate [action contract](https://developers.docusign.com/extension-apps/extension-app-reference/app-manifest-reference/action/):

- [Bank account owner verification](https://developers.docusign.com/extension-apps/extension-app-reference/action-contracts/bank-account-owner-verification/#request) example JSON request body:
  ```
  {
    "firstName": "Eliza",
    "lastName": "Monroe",
    "accountNumber": "123456789",
    "accountType": "checking",
    "routingNumber": "987654321"
  }
  ```
- [Bank account verification](https://developers.docusign.com/extension-apps/extension-app-reference/action-contracts/bank-account-verification/#request) example JSON request body:
  ```
  {
    "accountNumber": "123456789",
    "accountType": "checking",
    "routingNumber": "987654321"
  }
  ```
- [Business FEIN verification](https://developers.docusign.com/extension-apps/extension-app-reference/action-contracts/business-fein-verification/#request) example JSON request body:
  ```
  {
    "businessName": "VistaPeak Ventures",
    "fein": "11-1111111"
  }
  ```
- [Email address verification](https://developers.docusign.com/extension-apps/extension-app-reference/action-contracts/email-address-verification/#request) example JSON request body:
  ```
  {
    "email": "theo.clarkson@gmail.com"
  }
  ```
- [Phone verification](https://developers.docusign.com/extension-apps/extension-app-reference/action-contracts/phone-verification/#request) example JSON request body:
  ```
  {
    "phoneNumber": "1234567890",
    "region": "1"
  }
  ```
- [SSN verification](https://developers.docusign.com/extension-apps/extension-app-reference/action-contracts/ssn-verification/#request) example JSON request body:

  ```
  {
    "ssn": "111-11-1111",
    "firstName": "Nora",
    "lastName": "Bentley",
    "dateOfBirth": "1975-09-08"
  }
  ```

- [Postal address verification](https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/postal-address-verification#request/) There are two actions required by the postal address data verification extension contract.

  - Verify.Version1.PostalAddress: This action will return the verified address with a successful response if the request body exactly matches an entry in the sample database.

    Example JSON request body:

    **Note:** "street2" is an optional parameter.

    ```
    {
      "street1": "123 Main St",
      "street2": "Apt 4B",
      "locality": "Springfield",
      "subdivision": "IL",
      "countryOrRegion": "US",
      "postalCode": "62701-1234"
    }

    ```

  - Typeahead.Version1.PostalAddress: This action will return a list of suggested addresses based on if the sample database contains one or more partial matches to the request body.

    Example JSON request body:

    **Note:** "street2" is an optional parameter.

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

    Example JSON response:

    ```
    {
      "suggestions": [{
        "street1": "123 Main St",
        "street2": "Apt 4B",
        "locality": "Springfield",
        "subdivision": "IL",
        "countryOrRegion": "US",
        "postalCode": "62701-1234"
      }]
    }
    ```

### **Connected fields**

The `typeName` property in the sample input maps to the name of a concept in the `model.cto` file. Any valid concept name can be used in this field.

The `idempotencyKey` property in the sample input can be left as is.

The `data` property in the sample input are the key-value pairs of the properties of the `typeName` that is being verified, where the key is the name of the property within the concept, and the value is the input to verify. For example, if the concept is defined as:

```
@VerifiableType
@Term("Vehicle Identification")
concept VehicleIdentification {
    @IsRequiredForVerifyingType
    @Term("VIN")
    o String vin

    @IsRequiredForVerifyingType
    @Term("State of Registration")
    o String stateOfRegistration

    @IsRequiredForVerifyingType
    @Term("Country of Registration")
    o String countryOfRegistration
}
```

Then the Verify request body would be:
```
{
  "typeName": "VehicleIdentification",
  "idempotencyKey": "mockIdempotencyKey",
  "data": {
    "vin": "XRHFCSNGUP4YBU5HB",
    "stateOfRegistration": "CA",
    "countryOfRegistration": "USA"
  }
}
```

Running the Verify test with the example request body above should return the following properties in the response:
```
{
  "verified":true
  "verifyResponseMessage":"Vehicle identification   verification completed."
  "verificationResultCode":"SUCCESS"
  "verificationResultDescription":"Vehicle identification   verification completed."
}
```

### **Data IO**

**Note:** These instructions only apply if you use the [mock data](https://github.com/docusign/extension-app-data-io-reference-implementation/blob/main/src/db/fileDB.ts) in the reference implementation. If you use your own database, you’ll need to construct your requests based on your own schema. Queries for extension tests in the Developer Console are built using [IQuery](https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/custom-query-language/) structure. 


#### CreateRecord extension test
To begin the extension test process, run the CreateRecord test using the sample query below. The test should return a response containing the record ID.

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

![CreateRecord Test](https://github.com/user-attachments/assets/f962d007-2cab-49ce-a032-472cd214478d)


All record types are located in the `/src/db/` folder of this repository.

![db folder](https://github.com/user-attachments/assets/06449adc-057e-44c8-a76e-8406b29ae13e)


Open the `Account.json` file in the `/src/db/` folder and check that the records were created.

![Account.json](https://github.com/user-attachments/assets/37cca0e3-9113-4e01-a710-514b16763dbe)


#### SearchRecords extension test
This query searches the records that have been created. You don’t have to use the same sample values used here; the search should work with a valid attribute in `Account.json`.

Open the SearchRecords test and create a new query based on the `Account.json` file:

- The `from` attribute maps to the value of `typeName` in the CreateRecord query; in this case, `Account`.
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

![new search records](https://github.com/user-attachments/assets/4e6e26e2-040b-43a1-b20c-f69c84bcf765)

#### PatchRecord extension test
The `recordId` property in the sample input maps to an `Id` in the `Account.json` file. Any valid record ID can be used in this field.

In the `data` array, include any attributes and values to be added to the record. In this query, a new property will be added, and the original data in the record will be updated.

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

![PatchRecord test](https://github.com/user-attachments/assets/e445b06b-6790-475a-8434-c0eea1e003b3)

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


Alternatively, the `Account.json` file will contain the updated records. 

![Account.json after PatchRecord test](https://github.com/user-attachments/assets/ace8276b-2d36-4171-a598-2450e6d9b5fe)
