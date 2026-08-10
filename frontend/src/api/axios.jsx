//
//import axios from "axios";
//
//const apiClient = axios.create({
//    baseURL: import.meta.env.VITE_API_BASE_URL,
//});
//
//apiClient.interceptors.request.use(
//    (config) => {
//        const accessToken =
//            localStorage.getItem("accessToken");
//
//        console.log(
//            "========== AXIOS REQUEST =========="
//        );
//
//        console.log(
//            "URL:",
//            config.baseURL + config.url
//        );
//
//        console.log(
//            "ACCESS TOKEN:",
//            accessToken
//        );
//
//        if (accessToken) {
//            config.headers = config.headers || {};
//
//            config.headers.Authorization =
//                `Bearer ${accessToken}`;
//        }
//
//        console.log(
//            "AUTHORIZATION:",
//            config.headers?.Authorization
//        );
//
//        return config;
//    },
//    (error) => {
//        return Promise.reject(error);
//    }
//);
//
//export default apiClient;

import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiClient.interceptors.request.use(
    (config) => {
        const accessToken =
            localStorage.getItem("accessToken");

        console.log(
            "========== AXIOS REQUEST =========="
        );

        console.log(
            "URL:",
            `${config.baseURL}${config.url}`
        );

        console.log(
            "ACCESS TOKEN:",
            accessToken
        );

        if (accessToken) {
            config.headers = config.headers || {};

            config.headers.Authorization =
                `Bearer ${accessToken}`;
        }

        console.log(
            "AUTHORIZATION:",
            config.headers?.Authorization
        );

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error(
            "========== AXIOS RESPONSE ERROR =========="
        );

        console.error(
            "STATUS:",
            error.response?.status
        );

        console.error(
            "URL:",
            error.config?.url
        );

        console.error(
            "SERVER RESPONSE:",
            error.response?.data
        );

        return Promise.reject(error);
    }
);

export default apiClient;