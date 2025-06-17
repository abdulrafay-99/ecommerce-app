import {create} from "zustand"
import axiosInstance from "../lib/axios";

export const useUserStore= create((set,get)=>({
    user:null,
    getUser:()=> get().user,
    setUser:(user)=>set({user:user})
}))


// Axios interceptor for token refresh
let refreshPromise = null;

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// If a refresh is already in progress, wait for it to complete
				if (refreshPromise) {
					await refreshPromise;
					return axiosInstance(originalRequest);
				}

				// Start a new refresh process
				refreshPromise = await axiosInstance.post('/auth/refresh-token')
				
				refreshPromise = null;

				return axiosInstance(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login or handle as needed
				try {
			await axiosInstance.post("/auth/logout");
			useUserStore().getState().setUser(null);
		} catch (error) {
			toast.error(error.response?.data?.message || "An error occurred during logout");
		}
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);