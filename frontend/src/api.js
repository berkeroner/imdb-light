const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://imdb-light.onrender.com"
    : "http://127.0.0.1:5000";

const API = axios.create({
  baseURL: BASE_URL,
});

export default API;
