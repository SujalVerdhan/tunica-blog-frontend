// App.js
import React, { useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const App = () => {
  const handleLoginSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    console.log(token);
    try {
      const response = await axios.post(
        "https://tunica-blogs-backend.onrender.com/api/auth/google-login",
        { accessToken },
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
    const loadFacebookSDK = () => {
      return new Promise((resolve, reject) => {
        if (document.getElementById("facebook-jssdk")) {
          resolve(); // SDK already loaded
          return;
        }

        const script = document.createElement("script");
        script.id = "facebook-jssdk";
        script.src = "https://connect.facebook.net/en_US/sdk.js";
        script.onload = resolve;
        script.onerror = () => reject(new Error("Failed to load Facebook SDK"));
        document.body.appendChild(script);
      });
    };

    loadFacebookSDK()
      .then(() => {
        if (window.FB) {
          window.FB.init({
            appId: "435169396230093", // Replace with your Facebook App ID
            cookie: true,
            xfbml: true,
            version: "v15.0", // Use a valid Facebook Graph API version
          });
          console.log("Facebook SDK loaded and initialized");
        }
      })
      .catch((err) => {
        console.error("Failed to load Facebook SDK:", err);
      });
  }, []);

  const handleFacebookLogin = () => {
    if (!window.FB) {
      console.error("Facebook SDK not loaded yet");
      return;
    }

    window.FB.login(
      (response) => {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;

          // Use an immediately invoked function expression (IIFE) for async logic
          console.log(accessToken)(async () => {
            try {
              const res = await axios.post(
                "http://localhost:5000/api/auth/facebook-login", // Replace with your backend endpoint
                { accessToken },
                { withCredentials: true }
              );
              console.log("Login successful:", res.data);
            } catch (error) {
              console.error(
                "Error during Facebook login:",
                error.response?.data || error.message
              );
            }
          })();
        } else {
          console.error("User cancelled login or did not fully authorize.");
        }
      },
      { scope: "email,public_profile" } // Request email and profile permissions
    );
  };
  return (
    <>
      <GoogleOAuthProvider clientId="413844460861-qf9d78app2rli9t0b5l63pdqf5kcgkls.apps.googleusercontent.com">
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
