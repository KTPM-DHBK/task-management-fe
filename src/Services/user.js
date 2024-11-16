import request from "./API/request";

const baseURL = process.env.REACT_APP_API_URL + "/user";

class UserServices {
  async getUser({ limit, page, search }) {
    const response = await request({
      method: "GET",
      baseURL,
      params: {
        ...(limit && { limit }),
        ...(page && { page }),
        ...(search && { search })
      }
    });
    return response.data;
  }

  // Method to get a user by ID
  async getUserById(id) {
    const response = await request({
      method: "GET",
      baseURL: `${baseURL}/${id}`
    });
    return response.data;
  }

  // Method to update a user by ID
  async updateUser({ name, bio, avatarUrl }) {
    try {
      const body = Object.fromEntries(
        Object.entries({ name, bio, avatarUrl }).filter(([, value]) => value)
      );
      const response = await request.patch(`/auth/me`, body);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Method to change password
  async changePassword({ currentPassword, newPassword }) {
    try {
      const response = await request.patch(`/auth/change-password`, {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Method to delete a user by ID
  deleteUser(userId) {}

  async searchUser(searchValue) {
    return await request.get(`/user?search=${searchValue}`);
  }
}

const userServices = new UserServices();

export default userServices;
