import { useQuery } from "@tanstack/react-query";
import { workspaceServices } from "../Services";
import { EQueryKeys } from "../constants";

const useGetWorkspaceByUser = (options = {}) => {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: [EQueryKeys.GET_WORKSPACE_BY_USER],
    queryFn: () => workspaceServices.getWorkspaceByUser(options),
    ...{
      refetchOnWindowFocus: false,
    },
  });

  return { workspaceInfo: data?.data, isLoading, isError, refetch, isFetching };
};

const useGetBoardWorkspace = (options = {}) => {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: [EQueryKeys.GET_BOARD_WORKSPACE],
    queryFn: () => workspaceServices.getBoardWorkspace(options),
    ...{
      refetchOnWindowFocus: false,
    },
  });

  return { workspaceBoard: data?.data, isLoading, isError, refetch, isFetching };
};

const useGetWorkspaceById = (id) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [EQueryKeys.GET_WORKSPACE_BY_ID, id],
    queryFn: () => workspaceServices.getWorkspaceById(id),
    ...{
      refetchOnWindowFocus: false,
      enabled: !!id && !isNaN(Number(id)),
    },
  });

  return { workspaceDetails: data, isLoading, isError, refetch };
};

export { useGetWorkspaceByUser, useGetWorkspaceById, useGetBoardWorkspace };
