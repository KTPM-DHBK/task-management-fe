import request from "../request";

export async function createBoard(boardData) {
  try {
    const response = await request.post("/board", boardData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export function getWorkspaceById(id) {
  return request.get(`/workspace/${id}`);
}

// get All board
export async function getBoard(options) {
  try {
    const response = await request.get(`/board`, {
      params: {
        ...options
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// get board theo id
export async function getBoardId(id) {
  try {
    const response = await request.get(`/board/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// delete board theo di
export async function deleteBoardId(id) {
  try {
    const response = await request.delete(`/board/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getAllMembersByIdBoard(id) {
  return await request.get(`/board/${id}/members`);
}

export async function getAllTagByIdBoard(id) {
  return await request.get(`/tag/board/${id}`);
}

export async function leaveBoard(boardId) {
  return await request.delete(`/board/${boardId}/members`);
}

export async function removeMember(userId, boardId) {
  return await request.delete(`/board/${boardId}/members/${userId}`);
}

export async function updateBoard(boardId, data) {
  return await request.patch(`/board/${boardId}`, data);
}
