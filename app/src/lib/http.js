import axios from "axios";
import localstorage from "@/lib/localstorage.js";

function setHeaderFromConfig(config) {
	if (config && config.headers && config.headers["x-token"]) {
		http.defaults.headers.common["Authorization"] =
			`Bearer ${config.headers["x-token"]}`;
		localstorage.save("token", config.headers["x-token"]);
		//api.users.saveToken(config.headers["x-token"]);
	}
}

let baseUrl = "http://localhost:2000";

if (import.meta && import.meta.env.VITE_API_URL) {
	baseUrl = import.meta.env.VITE_API_URL;
}

const http = axios.create({
	baseURL: baseUrl, // Replace with your actual API URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Add a response interceptor to handle successful responses
http.interceptors.response.use(
	(res) => {
		setHeaderFromConfig(res);
		return res;
	},
	(err) => {
		// Handle any HTTP errors here
		let error = {
			message: "Something went wrong, please try again.",
		};
		if (err.response) {
			error = err.response.data;
			// The request was made, but the server responded with an error status code
			//console.error("HTTP Error Status:", err.response.status);
			//console.error("Response Data:", err.response.data);
			//console.error("Response Headers:", err.response.headers);
		} else if (err.request) {
			console.log(err.request);
			error = {
				message: `No response received from the server.`,
			};
			// The request was made but no response was received
			//console.error("No response received from the server.");
		} else {
			error = {
				message: err.message,
			};
			// Something else happened while setting up the request
			//console.error("Request error:", err.message);
		}

		// You can throw the error again if needed
		return Promise.reject(error);
	},
);

export const setToken = function (token) {
	http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const setTestMode = function (condition) {
	http.defaults.headers.common["X-Test"] = condition;
};

export default http;
