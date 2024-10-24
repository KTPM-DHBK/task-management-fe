import { useQuery } from "@tanstack/react-query";
import { userServices } from "../Services";
import { EQueryKeys } from "../constants";
import { useMemo } from "react";

const useGetUser = (options = {}) => {
  const queryKey = useMemo(
    () => [EQueryKeys.GET_USER, JSON.stringify(options)],
    [options]
  );

  const {
    data: userInfo,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey,
    queryFn: () => userServices.getUser(options),
    ...{
      refetchOnWindowFocus: false,
      enabled: !!Object.keys(options).length
    }
  });

  return { userInfo, isLoading, isError, refetch };
};

export default useGetUser;
