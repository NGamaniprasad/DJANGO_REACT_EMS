import apiClient from "../api/axios";

const authService = {
    async login(employeeId, username, password) {
        const response = await apiClient.post(
            "/auth/login/",
            {
                employee_id: employeeId,
                username: username,
                password: password,
            }
        );

        console.log(
            "AUTH LOGIN RESPONSE:",
            response.data
        );

        return response.data;
    },

    async getCurrentUser() {
        const response = await apiClient.get(
            "/auth/me/"
        );

        return response.data;
    },

    async refreshToken(refreshToken) {
        const response = await apiClient.post(
            "/auth/refresh/",
            {
                refresh: refreshToken,
            }
        );

        return response.data;
    },

    async logout(refreshToken) {
        const response = await apiClient.post(
            "/auth/logout/",
            {
                refresh: refreshToken,
            }
        );

        return response.data;
    },

    async changePassword(data) {
        const response = await apiClient.post(
            "/auth/change-password/",
            data
        );

        return response.data;
    },
};

export default authService;