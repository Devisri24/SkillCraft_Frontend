// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://skillcraft-backend-d4v6.onrender.com/api",
});

export default API;
