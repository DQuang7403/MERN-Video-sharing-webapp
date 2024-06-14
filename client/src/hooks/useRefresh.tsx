import axios from "../api/axios";
import { setAuth } from "../redux/userSlice";
import { logout } from "../redux/userSlice";
import { useAppDispatch } from "../redux/hooks";
export const useRefresh = () => {
  const dispatch = useAppDispatch();

  const refresh = async () => {
    try {
      const res = await axios.get("/auth/refresh", {
        withCredentials: true,
      });
      if (res.status === 200) {
        dispatch(setAuth(res.data));
        return res.data.access_token;
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        dispatch(logout());
      }
    }
  };
  return refresh;
};
