import request from "./API/request";

const baseURL = "http://localhost:3001/api/workspace";

class WorkspaceServices {
  async createWorkspace(workspaceData) {
    const response = await request({
      method: "POST",
      baseURL,

      data: JSON.stringify(workspaceData)
    });
    return response.data;
  }

  async getWorkspaceByUser({ limit, page }) {
    const response = await request({
      method: "GET",
      baseURL,
      params: {
        ...(limit && { limit }),
        ...(page && { page })
      }
    });
    return response.data;
  }

  // Method to get a Workspace by ID
  async getWorkspaceById(id) {
    const response = await request({
      method: "GET",
      baseURL: `${baseURL}/${id}`
    });
    return response.data;
  }

  // Method to update a Workspace by ID
  updateWorkspace(workspaceId, updatedData) {}

  // Method to delete a Workspace by ID
  deleteWorkspace(workspaceId) {}

  async addWorkspaceMember(userId, workspaceId, role) {
    const response = await request({
      method: "POST",
      baseURL: `${baseURL}/add-member`,
      data: JSON.stringify({ userId, workspaceId, role })
    });
    return response.data;
  }

  async removeWorkspaceMember(workspaceId, memberId) {
    const response = await request({
      method: "DELETE",
      baseURL: `${baseURL}/remove-member`,
      data: JSON.stringify({ memberId })
    });
    return response.data;
  }

  async updateWorkspaceMember(workspaceId, memberId, updatedData) {
    const response = await request({
      method: "PATCH",
      baseURL: `${baseURL}/update-member`,
      data: JSON.stringify({ memberId, updatedData })
    });
    return response.data;
  }
}

const workspaceServices = new WorkspaceServices();

export default workspaceServices;
