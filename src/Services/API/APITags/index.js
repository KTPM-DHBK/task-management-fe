import request from "../request";

export async function getTags(boardId) {
  const response = await request.get(`/board/${boardId}/tag`);
  return response?.data;
}

export async function updateTag({ boardId, name, color, tagId }) {
  boardId = Number(boardId);
  const response = await request.patch(`/board/${boardId}/tag/${tagId}`, {
    boardId,
    name,
    color,
  });
  return response?.data;
}

export async function createTag({ boardId, name, color }) {
  const response = await request.post(`/board/${boardId}/tag`, {
    boardId,
    name,
    color,
  });
  return response?.data;
}

export async function deleteTag(boardId, tagId) {
  const response = await request.delete(`/board/${boardId}/tag/${tagId}`);
  return response?.data;
}
