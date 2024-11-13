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

export async function JoinToCard(idCard, idUser) {
  return await request.post(`/card/${idCard}/assign`, {
    userId: idUser,
  });
}

export async function RemoveUserToCard(idCard, idUser) {
  return await request.delete(`/card/${idCard}/members/${idUser}`);
}

export async function changePositionCard({ cardId, activeListId, overListId, position }) {
  const response = await request.post(`/card/${cardId}/move`, {
    listId1: activeListId,
    listId2: overListId,
    position,
  });
  return response?.data;
}

export async function getArchivedCards(boardId) {
  const response = await request.get(`/board/${boardId}/cards/archived`);
  return response?.data;
}
