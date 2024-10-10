import { useQuery } from "@tanstack/react-query";
import { workspaceServices } from "../Services";
import { EQueryKeys } from "../constants";

const useGetWorkspaceByUser = (options = {}) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [EQueryKeys.GET_WORKSPACE_BY_USER],
    queryFn: () => workspaceServices.getWorkspaceByUser(options),
    ...{
      refetchOnWindowFocus: false
    }
  });

  return { workspaceInfo: data?.data, isLoading, isError, refetch };
};

export default useGetWorkspaceByUser;