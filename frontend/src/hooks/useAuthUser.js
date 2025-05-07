import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false, // auth check (do not retry to do request)
  });

  return {
    isLoading: authUser.isLoading,
    authUser: authUser.data?.data.user,
  };
};

export default useAuthUser;
