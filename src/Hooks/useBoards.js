import { useQuery } from "@tanstack/react-query";
import { getBoard } from "../Services/API/ApiBoard/apiBoard";
import { EQueryKeys } from "../constants";
import { useStorage } from "../Contexts";

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

export const useGetAllCardByList = (listId, boardId) => {
  const { isLoggedIn } = useStorage();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [EQueryKeys.GET_CARD_BY_LIST, JSON.stringify(options)],
    queryFn: () => getBoard(listId, boardId),
    ...{
      refetchOnWindowFocus: false,
      enabled: isLoggedIn,
    },
  });

  return { boardData: data, isLoading, isError, refetch };
};
