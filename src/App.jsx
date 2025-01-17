// App.js
import React, { useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const App = () => {
  const handleLoginSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    try {
      const response = await axios.post(
        "https://tunica-blogs-backend.onrender.com/api/auth/google-login",
        { token },
        { withCredentials: true }
      );
      console.log("User details from backend:", response.data);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleLoginFailure = (error) => {
    console.error("Login failed:", error);
  };

  useEffect(() => {
    // Initialize Facebook SDK
    (function (d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      const js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");

    window.fbAsyncInit = () => {
      window.FB.init({
        appId: "435169396230093", // Replace with your Facebook App ID
        cookie: true,
        xfbml: true,
        version: "v12.0",
      });
    };
  }, []);

  const handleFacebookLogin = () => {
    window.FB.login(
      async (response) => {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;

          try {
            // Send the access token to the backend
            const res = await axios.post(
              "https://tunica-blogs-backend.onrender.com/api/auth/facebook-login",
              { accessToken },
              { withCredentials: true } // Include cookies
            );
            console.log("Login successful:", res.data);
          } catch (error) {
            console.error(
              "Error during Facebook login:",
              error.response?.data || error.message
            );
          }
        } else {
          console.error("User cancelled login or did not fully authorize.");
        }
      },
      { scope: "email,public_profile" } // Request email and profile permissions
    );
  };

  return (
    <>
      <GoogleOAuthProvider clientId="1096811418908-clkn2373bh04ggmkodi73rt58aebc880.apps.googleusercontent.com">
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h1>Google Authentication</h1>
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
          />
        </div>
      </GoogleOAuthProvider>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h1>Facebook Authentication</h1>
        <button onClick={handleFacebookLogin}>Login with Facebook</button>
      </div>
    </>
  );
};

export default App;
