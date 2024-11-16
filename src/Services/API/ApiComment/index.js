import request from "../request";

// Api post comment
export function postComment(boardId, params) {
  return request.post(`/board/${boardId}/comment`, params);
}

// Api get comment
export function getComment(boardId, cardId) {
  return request.get(`/board/${boardId}/comment/card/${cardId}`);
}

// Api update comment
export function updateComment(boardId, id, params) {
  return request.put(`/board/${boardId}/comment/${id}`, params);
}

// Api delete comment
export function deleteComment(boardId, id) {
  return request.delete(`/board/${boardId}/comment/${id}`);
}
