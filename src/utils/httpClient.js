import axios from "axios";

export const httpClient = axios.create({
  baseURL: "https://mate.academy/students-api",
});

httpClient.interceptors.response.use(res => res.data);
