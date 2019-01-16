import constants from "./constants";
import Axios from "axios";
import qs from "qs";

const url = `${constants.base_url}/caravan`;

const headers = {
  authorization: `Bearer ${constants.token}`,
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/x-www-form-urlencoded"
};

export default {
  post: async data => {
    let response;
    try {
      response = await Axios({
        method: "POST",
        headers,
        data: qs.stringify(data),
        url
      });
      return response;
    } catch (e) {
      return e.response.data;
    }
  },

  get: async () => {
    try {
      const response = await Axios({
        method: "GET",
        headers,
        url
      });

      return response;
    } catch (e) {
      return e.response.data;
    }
  }
};
