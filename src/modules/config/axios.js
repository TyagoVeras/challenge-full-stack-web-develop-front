import axios from "axios";

const appConfig = {
  baseURL: "http://localhost:3333/",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

const axiosApp = axios.create(appConfig);

export default axiosApp;