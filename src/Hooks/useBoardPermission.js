import { useQuery } from "@tanstack/react-query";
import { EQueryKeys } from "../constants";
import {
  getBoardPermission,
  getBoardRole
} from "../Services/API/apiBoardPermission";

export const useGetBoardPermission = (boardId) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [EQueryKeys.GET_BOARD_PERMISSION, boardId],
    queryFn: () => getBoardPermission(boardId),
    ...{
      refetchOnWindowFocus: false,
      enabled: !!boardId
    }
  });

  const getBoardPermissionByUser = (item) => {
    const moduleName = "board";
    return data?.find(
      (el) => el.moduleName === moduleName && el.actionName === item
    );
  };

  const getListPermissionByUser = (item) => {
    const moduleName = "list";
    return data?.find(
      (el) => el.moduleName === moduleName && el.actionName === item
    )?.isGranted;
  };

  const getCardPermissionByUser = (item) => {
    const moduleName = "card";
    return data?.find(
      (el) => el.moduleName === moduleName && el.actionName === item
    )?.isGranted;
  };

  const getCommentPermissionByUser = (item) => {
    const moduleName = "comment";
    return data?.find(
      (el) => el.moduleName === moduleName && el.actionName === item
    )?.isGranted;
  };

  const getTagPermissionByUser = (item) => {
    const moduleName = "tag";
    return data?.find(
      (el) => el.moduleName === moduleName && el.actionName === item
    )?.isGranted;
  };

  return {
    dataBoardPermission: data,
    isLoading,
    isError,
    refetch,
    getBoardPermissionByUser,
    getListPermissionByUser,
    getCardPermissionByUser,
    getCommentPermissionByUser,
    getTagPermissionByUser
  };
};

export const useGetBoardRole = (boardId) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [EQueryKeys.GET_BOARD_ROLE, boardId],
    queryFn: () => getBoardRole(boardId),
    ...{
      refetchOnWindowFocus: false,
      enabled: !!boardId
    }
  });

  return { dataBoardRole: data, isLoading, isError, refetch };
};
