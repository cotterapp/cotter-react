# cotter-react

## Installation

```bash
yarn add cotter-react

#or

npm install cotter-react --save
```

## Get Started

To use the `CotterProvider`, you need to wrap your root component with `CotterProvder`.

### Wrap your Root Component with `CotterProvider`

```javascript
import React from "react";
import { Router } from "@reach/router";
import LoginPage from "../login";
import { CotterProvider, LoginForm } from "cotter-react"; // 👈  Import Cotter Provider

function App() {
  return (
    // 👇 1) Wrap CotterProvider around your ROOT COMPONENT
    <CotterProvider apiKeyID="<YOUR API KEY ID>">  // 👈  Copy paste your Cotter API Key ID.
      <Router>
        <LoginPage path="/" />
      </Router>
    </CotterProvider>
  );
}

export default App;
```

## Available Functions
Using the React SDK, we have included [`CotterProvider`](https://github.com/cotter-code/react-starter-app/blob/master/src/pages/_app/index.js#L13) for authentication state management.
- [Adding the `LoginForm`](#adding-the-loginform)
- [Using the `CotterProvider`](#using-the-cotterprovider)
- [Require authentication using `withAuthenticationRequired`](#require-authentication-using-withAuthenticationRequired)

### Adding the `LoginForm`
The `LoginForm` component automatically sends a verification email or SMS to the entered email or phone number, and respond with the results.

To use the `LoginForm` component, you can import `LoginForm` and do the following:
```javascript
<LoginForm
  type="EMAIL"                    // - EMAIL or PHONE
  authMethod="MAGIC_LINK"         // - OTP or MAGIC_LINK
  onBegin={onSignupBegin}         // - A function that runs before verification email/SMS is sent
  onSuccess={onSignupSuccess}     // - A function that runs after the login/signup is successful
  onError={onSignupError}         // - A function that runs if the login/signup encountered an error
  width={340}                     // - Width & height of the form
  height={300}                    //   Recommended at least 300x300
  additionalFields={[             // - The form includes 1 field for email/phone. Use this to add
    {                             //   more fields.
      name: "name",
      label: "Full Name",
      placeholder: "Enter your full name",
    },
  ]}
  styles={loginFormStyles}        // - You can style the form on Cotter's Dashboard or pass in CSS here.
/>
```

**`onBegin` function:**

The `onBegin` function receives the user entered fields as a parameter. 
- To stop submission and display an error, **return a string with the error message**.
- To continue submission with no error, **return null**.
[Learn more about `onBegin` function](https://docs.cotter.app/sdk-reference/web/web-sdk-verify-email-phone/checking-the-email-or-phone-before-sending-a-verification-code)

For example:
```javascript
const myOnBeginFunction = (payload) => {
  if (payload.identifier === "myemail@gmail.com") {
    // If there's an error, return a string with the error message
    return "Phone Number is not allowed";
  }
  // If there's no error, return null
  return null;
}

// Payload object looks like this
var payload = {
  identifier: "myemail@gmail.com",
  identifier_type: "PHONE",
  device_type: "BROWSER",
  device_name: "Chrome ...",
  client_json: { // This is available if you set up AdditionalFields
    "name": "Hello World",
    "address": "Street Address"
  }
};
```


**`onSuccess` function:**

When the user successfully login or sign up, the `onSuccess` function will receive a response from Cotter that includes the user-entered fields an a JWT token to validate the user successfully verified their email or phone number. 
[Learn more about `onSuccess` function](https://docs.cotter.app/sdk-reference/web/web-sdk-verify-email-phone#step-3-sending-the-payload-to-your-backend-server)

For example:
```javascript
const onSuccessFunc = (payload) => {
  // Send data to Server
  axios
    .post("https://slug.brev.dev/login", payload)
    .then((resp) => console.log("Response From Server", resp))
    .catch((err) => console.log(err));
}

// Payload object looks like this:
var payload {
    "email": "myemail@gmail.com", // User's email (or phone number),
    "name": "Hello World",
    "address": "Street Address",
    "oauth_token": {
        "access_token": "eyJhbGciOiJFUzI1NiIsImt...", // Access Token to validate
        "id_token": "eyJhbGciOiJFUzI1Ni...",
        "refresh_token": "27805:CNf76faa8trMhjXM...",
        "expires_in": 3600,
        "token_type": "Bearer",
        "auth_method": "OTP"
    },
    "user": {
        "ID": "abcdefgh-abcd-abcd-abcd-af6f81fb5432", // Cotter User ID
        "issuer": "<YOUR_API_KEY_ID>",
        "identifier": "myemail@gmail.com"
    }
}
```


**`onError` function:**

When there's an error, the `onError` function will be invoked. The error returned may differ based on the error, you should display an error message when this is invoked, and try it in `console.log` to see the error responses.

**`additionalFields`:**
The default form includes 1 field which is the email input or phone number input. If you want to collect more information, use this to add more fields.
For example:
```javascript
const additionalFields = [
          {
            label: "Full Name",
            name: "name",
            placeholder: "Enter your full name"
          },
          {
            label: "Address",
            name: "address",
            placeholder: "Enter your address"
          },
          {
            label: "Prefilled Info",
            name: "prefilled",
            type: "hidden",     // availabe types are the same as HTML input type.
            initial_value: "autofill value"
          }
        ]
```


**`styles`:**

There are 2 ways to style your login form.
- Customize the form from the [Cotter Dashboard](https://dev.cotter.app)
- Pass in a styles object

To pass in a styles object, you can find each component's class name using inspect element, then add the style for each class name like the following:
```javascript
const styles = {
    input_label: {
      fontFamily: "Roboto",
      fontSize: 15,
      color: "red",
      fontWeight: 700,
    },
    input_text_container_default: {
      backgroundColor: "#fce883",
      padding: "20px 60px",
    },
    input_text: {
      backgroundColor: "#fce883",
      fontFamily: "Roboto",
      fontSize: 20,
    },
    button_container: {
      borderRadius: 0,
    },
    button_text: {
      color: "aqua",
    },
  }
```

### Using the `CotterProvider`
The `CotterProvider` provides you with useful authentication state and the current user information. To use it:
```javascript
const { isLoading, isLoggedIn, user, logout, getCotter, apiKeyID, checkLoggedIn } = useContext(CotterContext);
```

- **`isLoading`** (bool): tells you if the CotterProvider is loading the necessary data
- **`isLoggedIn`** (bool): tells you if the user is logged-in or not
- **`user`** (object): gives you the user object of the currently logged-in user
```javascript
const user = {
    "ID": "abcdefgh-abcd-abcd-abcd-67ebae3cdfcf",
    "issuer": "abcdefgh-abcd-abcd-abcd-5cc8b69051e8",
    "client_user_id": "abcdefgh-abcd-abcd-abcd-67ebae3cdfcf",
    "enrolled": [
        "WEBAUTHN"
    ],
    "identifier": "putri@cotter.app"
}
```
- **`getAccessToken`** (async function): returns the Cotter Access Token object. To get the string encoded JWT access token to pass to your backend, use
```javascript
const token = await getAccessToken();
const accessTokenStr = token?.token;
```
- **`logout`** (async function): a function to logout the user
```javascript
<div onClick={logout}>Log Out</div>
```
- **`getCotter`** (function): a function to get the Cotter object. [Check out the docs on what you can do with the Cotter object.](https://docs.cotter.app/sdk-reference/web)
- **`apiKeyID`** (string): your API KEY ID that you passed-in to the `CotterProvider`
- **`checkLoggedIn`** (async function): a function to force the `CotterProvider` to check if the user's logged-in

### Require Authentication using `withAuthenticationRequired`
This wrapper will check if the user is logged-in, if not, it'll redirect to the `loginPagePath`
```javascript
import { withAuthenticationRequired } from "cotter-react";

function DashboardPage() {...}

// Protect this page using the `withAuthenticationRequired` HOC
// If user is not logged-in, they'll be redirected to the `loginPagePath`
export default withAuthenticationRequired(DashboardPage, {
  loginPagePath: "/",
});
```

