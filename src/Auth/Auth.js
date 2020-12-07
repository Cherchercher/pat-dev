import auth0 from "auth0-js";
import { AUTH_CONFIG } from "./auth0-variables";
import history from "../history";
import Parse from "parse/node";
require("dotenv").config();

const callback = process.env.REACT_APP_AUTH_CALLBACKURL;

export default class Auth {
  requestedScopes = "openid profile email read:messages write:messages";
  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: callback,
    //audience: 'http://' + AUTH_CONFIG.domain + '/userinfo',
    audience: AUTH_CONFIG.apiUrl,
    responseType: "token id_token",
    scope: this.requestedScopes
  });

  constructor() {
    this.userProfile = null;
    this.parseProfile = null;
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.userHasScopes = this.userHasScopes.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  userProfile = {};
  parseProfile = {};

  handleAuthentication() {
    try {
      var hash = window.location.hash.substr(1);
      var authResult = {};
      hash
        .split("&")
        .map(item => (authResult[item.split("=")[0]] = item.split("=")[1]));

      if (authResult && authResult.access_token && authResult.id_token) {
        this.setSession(authResult);

        return "success";
      }
    } catch (e) {
      console.log(e);
    }
    return "failure";
  }

  setSession(authResult) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify(
      authResult.expires_in * 1000 + new Date().getTime()
    );
    // If there is a value on the `scope` param from the authResult,
    // use it to set scopes in the session for the user. Otherwise
    // use the scopes as requested. If no scopes were requested,
    // set it to nothing
    const scopes = authResult.scope || this.requestedScopes || "";

    localStorage.setItem("access_token", authResult.access_token);
    localStorage.setItem("id_token", authResult.id_token);
    localStorage.setItem("expires_at", expiresAt);
    localStorage.setItem("scopes", JSON.stringify(scopes));
    this.getProfile(async (err, profile) => {
      if (profile) {
        localStorage.setItem("profile", profile);
        const parseUser = await this.getParseProfile(profile);
        localStorage.setItem("parseProfile", parseUser);
      }
    });

    // navigate to the home route
  }

  getAccessToken() {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      throw new Error("No access token found");
    }
    return accessToken;
  }

  getProfile(callbackf) {
    let accessToken = this.getAccessToken();
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        this.userProfile = profile;
      }
      callbackf(err, profile);
    });
  }

  getParseProfile(profile, callback) {
    var value = Parse.User.become(
      profile["https://planatripback.herokuapp.com/parse/parse_session_token"]
    ).then(
      function(user) {
        return user;
      },
      function(error) {
        console.log(error);
        return null;
        // The token could not be validated.
      }
    );
    return value;
  }

  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("scopes");
    this.userProfile = null;
    // navigate to the home route
    history.replace("/explore");
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    return new Date().getTime() < expiresAt;
  }

  userHasScopes(scopes) {
    const grantedScopes = (
      JSON.parse(localStorage.getItem("scopes")) || ""
    ).split(" ");
    return scopes.every(scope => grantedScopes.includes(scope));
  }
}
