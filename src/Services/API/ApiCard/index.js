import request from "../request";

export async function createCardByIdList(dataCard) {
  try {
    const response = await request.post(`/card`, dataCard);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getAllCardByIdList(id, boardId) {
  return await request.get(`/board/${boardId}/list/${id}/cards`);
}

export function getCardById(id) {
  return request.get(`/card/${id}`);
}

export async function getAllUserByIdCard(id) {
  return await request.get(`/card/${id}/members`);
}

export async function updateCard(id, data) {
  return await request.patch(`/card/${id}`, data);
}

export async function deleteCard(cardId) {
  try {
    const response = await request.delete(`/card/${cardId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
