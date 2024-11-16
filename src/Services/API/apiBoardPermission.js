import request from "./request";

export const getBoardPermission = async (boardId, roleId) => {
  try {
    const response = await request.get(`/board/${boardId}/permission`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getBoardRole = async (boardId) => {
  try {
    const response = await request.get(`/board/${boardId}/role`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const createBoardRole = async (boardId, name) => {
  try {
    const response = await request.post(`/board/${boardId}/role`, {
      name
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const updateBoardPermission = async (boardId, payload) => {
  try {
    const response = await request.put(`/board/${boardId}/permission`, payload);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};
