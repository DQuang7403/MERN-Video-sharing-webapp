import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import { useRefresh } from "./useRefresh";
import { useAppSelector } from "../redux/hooks";

export const useAxiosPrivate = () => {
  const refresh = useRefresh();
  const { token } = useAppSelector((state) => state.user);

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        
        return Promise.reject(error)
      },
    );
    return () => {
      axiosPrivate.interceptors.response.eject(responseIntercept);
      axiosPrivate.interceptors.request.eject(requestIntercept);
    };
  }, [token, refresh]);

  return axiosPrivate;
};
