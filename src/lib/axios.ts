import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response) {
      const apiError = error.response.data;

      return Promise.reject({
        message: apiError?.message || "An unknown error occurred",
        status: apiError?.statusCode || error.response.status,
        error: apiError?.error || null,
        raw: apiError, 
      });
    }

    if (error.request) {
      return Promise.reject({
        message: "No response received from the server. Please try again.",
        status: null,
        error: "Network Error",
      });
    }

    return Promise.reject({
      message: error.message || "An unexpected error occurred",
      status: null,
      error: "Unknown",
    });
  }
);

export default apiClient;
