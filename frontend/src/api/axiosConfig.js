import axios from "axios";

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 1000,
});

apiClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			console.error("Unauthorized or Token Expired - Redirecting to login.");
			localStorage.removeItem("token");
			localStorage.removeItem("userID");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	},
);

export default apiClient;
