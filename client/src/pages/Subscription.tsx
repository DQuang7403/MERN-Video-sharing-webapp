import { useEffect, useState } from "react";
import GridVideos from "../layouts/GridVideos";
import { useAxiosPrivate } from "../hooks/useAxiosPrivate";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { logout } from "../redux/userSlice";
import { useAppDispatch } from "../redux/hooks";

export default function Subcription() {
  const axiosPrivate = useAxiosPrivate();
  const [subVideos, setSubVideos] = useState([]);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getSubVideos = async () => {
      try {
        const res = await axiosPrivate.get(`/video/sub`, {
          signal: controller.signal,
        });
        isMounted && setSubVideos(res.data);
      } catch (error: any) {
        if (error?.response?.status === 403) {
          dispatch(logout());
          navigate("/login", { state: { from: location }, replace: true });
        }
        console.log(error);
      }
    };
    getSubVideos();
    return () => {
      isMounted = false;
      isMounted && controller.abort;
    };
  }, []);
  return (
    <div className="pt-6 sm:mx-7 min-h-[calc(100vh-64px)] mx-2">
      <div className="flex items-center mb-4 justify-between">
        <h2 className="text-lg font-semibold ">Latest Videos</h2>
        <Button
          type="button"
          variant="ghost"
          size="auth"
          className=" text-blue-500 "
        >
          <Link to={"/feed/channel"}>Manage</Link>
        </Button>
      </div>
      {subVideos.length === 0 ? (
        <div>Subscribe to view latest videos </div>
      ) : (
        <GridVideos videos={subVideos} />
      )}
    </div>
  );
}
