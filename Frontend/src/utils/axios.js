import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error("No internet connection. Please check your network.");
      return Promise.reject(error);
    }

    // Don't redirect for auth endpoints — their 401s are handled by the form's catch block
    const url = error.config?.url || "";
    const isAuthEndpoint = url.includes("/auth/me") || url.includes("/auth/login") || url.includes("/auth/register");
    if (error.response.status === 401 && !isAuthEndpoint) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
