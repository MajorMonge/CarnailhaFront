import constants from "./constants";
import Axios from "axios";
import qs from "qs";

const url = `${constants.base_url}/oauth/token`;

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/x-www-form-urlencoded"
};

const data = {
  client_id: "carnailhaWeb",
  client_secret: "carnaweb",
  grant_type: "password",
  username: "admin",
  password: "admin123",
  scope: "teste"
};

export default {
  post: async () => {
    let response;
    try {
      response = await Axios({
        method: "POST",
        headers,
        data: qs.stringify(data),
        url
      });
      window.localStorage.setItem("token", response.data.accessToken);
      return response.data.accessToken;
    } catch (e) {
      return e.response.data;
    }
  },

  get: async () => {
    return window.localStorage.getItem("token");
  }
};
