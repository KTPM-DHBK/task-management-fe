import request from "../request";

export async function getListByBoardID(id) {
  const response = await request.get(`/board/${id}`);
  return response?.data;
}

export async function CreateList(boardId, newData) {
  const response = await request.post(`/board/${boardId}/list`, newData);
  return response?.data;
}

export async function UpdateList(boardId, listId, newData) {
  const response = await request.patch(`/board/${boardId}/list/${listId}`, newData);
  return response?.data;
}

export async function DeleteList(idBoard, idList) {
  return await request.delete(`/board/${idBoard}/list/${idList}`);
}

export async function changePositionList({ boardId, listId, newPosition }) {
  const response = await request.post(`/board/${boardId}/list/arrange`, {
    listId1: `${listId}`,
    newPosition: `${newPosition}`,
  });
  return response?.data;
}
