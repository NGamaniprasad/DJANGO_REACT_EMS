

import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// ===============================
// REQUEST INTERCEPTOR
// ===============================
apiClient.interceptors.request.use(
    (config) => {
        const accessToken =
            localStorage.getItem("accessToken");

        if (accessToken) {
            config.headers = config.headers || {};

            config.headers.Authorization =
                `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ===============================
// RESPONSE INTERCEPTOR
// ===============================

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

const onRefreshed = (newAccessToken) => {
    refreshSubscribers.forEach((callback) => {
        callback(newAccessToken);
    });

    refreshSubscribers = [];
};

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },

    async (error) => {
        const originalRequest = error.config;

        // Only handle 401 responses
        if (
            error.response?.status !== 401 ||
            originalRequest?._retry
        ) {
            return Promise.reject(error);
        }

        const refreshToken =
            localStorage.getItem("refreshToken");

        // No refresh token → logout
        if (!refreshToken) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");

            window.location.href = "/login";

            return Promise.reject(error);
        }

        // Another request is already refreshing
        if (isRefreshing) {
            return new Promise((resolve) => {
                subscribeTokenRefresh((newAccessToken) => {
                    originalRequest.headers =
                        originalRequest.headers || {};

                    originalRequest.headers.Authorization =
                        `Bearer ${newAccessToken}`;

                    resolve(apiClient(originalRequest));
                });
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            console.log(
                "========== JWT REFRESH =========="
            );

            // IMPORTANT:
            // Use plain axios here so the refresh request
            // does not go through this interceptor again.
            const refreshResponse = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/auth/refresh/`,
                {
                    refresh: refreshToken,
                }
            );

            const newAccessToken =
                refreshResponse.data.access;

            const newRefreshToken =
                refreshResponse.data.refresh;

            if (!newAccessToken) {
                throw new Error(
                    "No access token returned from refresh"
                );
            }

            // Save new access token
            localStorage.setItem(
                "accessToken",
                newAccessToken
            );

            // If backend returns a rotated refresh token,
            // save it too.
            if (newRefreshToken) {
                localStorage.setItem(
                    "refreshToken",
                    newRefreshToken
                );
            }

            console.log(
                "NEW ACCESS TOKEN SAVED"
            );

            if (newRefreshToken) {
                console.log(
                    "NEW REFRESH TOKEN SAVED"
                );
            }

            // Resolve queued requests
            onRefreshed(newAccessToken);

            // Retry original request
            originalRequest.headers =
                originalRequest.headers || {};

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

            return apiClient(originalRequest);

        } catch (refreshError) {
            console.error(
                "JWT REFRESH FAILED",
                refreshError.response?.data
            );

            // Refresh token is invalid/expired
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");

            window.location.href = "/login";

            return Promise.reject(refreshError);

        } finally {
            isRefreshing = false;
        }
    }
);

export default apiClient;