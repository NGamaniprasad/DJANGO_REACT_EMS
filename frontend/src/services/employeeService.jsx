import apiClient from "../api/axios";

const employeeService = {
  async getMyProfile() {
    const response = await apiClient.get(
      "/employees/me/"
    );

    return response.data;
  },
};

export default employeeService;