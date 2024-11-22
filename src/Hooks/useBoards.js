import { useQueries, useQuery } from "@tanstack/react-query";
import { getAllMembersByIdBoard, getBoard, getBoardById } from "../Services/API/ApiBoard/apiBoard";
import { EQueryKeys } from "../constants";
import { useStorage } from "../Contexts";
import { getAllCardByList, getCardById } from "../Services/API/ApiCard";

export const useGetAllBoards = (options) => {
  const { isLoggedIn } = useStorage();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [EQueryKeys.GET_ALL_BOARD, JSON.stringify(options)],
    queryFn: () => getBoard(options),
    ...{
      refetchOnWindowFocus: false,
      enabled: isLoggedIn,
    },
  });

  return { boardData: data, isLoading, isError, refetch };
};

export const useGetBoardById = (boardId) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [EQueryKeys.GET_BOARD_BY_ID, boardId],
    queryFn: () => getBoardById(boardId),
    ...{
      refetchOnWindowFocus: false,
      enabled: !!boardId,
    },
  });

  return { data, isLoading, isError, refetch };
};

export const useGetMembersByBoard = (boardId) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [EQueryKeys.GET_MEMBERS_BY_BOARD, boardId],
    queryFn: () => getAllMembersByIdBoard(boardId),
    ...{
      refetchOnWindowFocus: false,
      enabled: !!boardId,
    },
  });

  return { data: data?.data || [], isLoading, isError, refetch };
};

export const useGetAllCardByList = (boardData) => {
  const cardQueries =
    boardData?.lists.map((list) => {
      return {
        queryKey: [EQueryKeys.GET_CARD_BY_LIST, list.id],
        queryFn: () => getAllCardByList(list.id, boardData.id),
        refetchOnWindowFocus: false,
      };
    }) || [];

  const { data, isLoading } = useQueries({
    queries: cardQueries,
    enabled: !!boardData,
    combine: (results) => {
      return {
        data: results.flatMap((result) => result.data?.data || []),
        isLoading: results.some((result) => result.isLoading),
      };
    },
  });

  return { data, isLoading };
};

export const useGetCardById = (cardId) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [EQueryKeys.GET_CARD_BY_ID, cardId],
    queryFn: () => getCardById(cardId),
    ...{
      refetchOnWindowFocus: false,
      enabled: !!cardId,
    },
  });

  return { data: data?.data, isLoading, isError, refetch };
};
