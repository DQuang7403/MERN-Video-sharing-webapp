import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import axios from "../api/axios";
import { ChannelType, VideoCardProps } from "../utils/Constansts";
import { Link, Outlet } from "react-router-dom";

export default function ProfilePage() {
  const { currentUser } = useAppSelector((state) => state.user);
  const [userDetail, setUserDetail] = useState<ChannelType>();
  const [videos, setVideos] = useState<VideoCardProps[]>([]);
  const [selected, setSelected] = useState<string>("video");
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await axios.get(`/user/find/${currentUser?._id}`);
        setUserDetail(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchUserVideo = async () => {
      try {
        const res = await axios.get(`/video/get/user/${currentUser?._id}`);
        setVideos(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserVideo();    
    fetchChannel();
  }, []);
  const setSelectedButton = (value: string) => {
    setSelected(value);
  };
  return (
    <section className="w-full flex-grow-1 overflow-auto min-h-[calc(100vh-64px)] md:px-20 px-2 py-8">
      <div className="w-full aspect-[7/1] min-h-40 mb-8 hidden md:block">
        {/* <div className="bg-primary w-full h-full rounded-lg "></div> */}
        <img
          src="https://img.freepik.com/free-vector/abstract-background-with-flowers_23-2148987425.jpg?w=2000"
          className="bg-primary w-full h-full rounded-lg object-cover"
          alt=""
        />
      </div>
      <div className=" flex items-center gap-4">
        <img src={userDetail?.profileUrl} className=" w-32 rounded-full" />
        <div className="flex flex-col gap-2 max-h-40">
          <h1 className="text-3xl font-semibold">{userDetail?.name}</h1>
          <div className="text-secondary-text text-sm flex gap-1 sm:flex-row flex-col ">
            <h2>@{userDetail?.username}</h2>
            <h2 className="sm:block hidden">•</h2>
            <div className="flex items-center gap-1">
              <h2>{userDetail?.subscribers} Subscribers</h2>
              <h2>•</h2>
              <h2>{videos.length} Videos</h2>
            </div>
          </div>
        </div>
      </div>
      <div className=" my-8 flex gap-6">
        <button
          onClick={() => setSelectedButton("video")}
          className={`${
            selected === "video"
              ? "text-primary-text border-primary-text "
              : "hover:text-secondary-text-hover text-secondary-text  border-b-transparent hover:border-secondary-text"
          } font-semibold text-lg pb-1 border-b-2`}
        >
          <Link to={`/profile`}>Video</Link>
        </button>
        <button
          onClick={() => setSelectedButton("detail")}
          className={`${
            selected === "detail"
              ? "text-primary-text border-primary-text border-b-2 "
              : "hover:text-secondary-text-hover text-secondary-text  border-b-transparent hover:border-secondary-text"
          } font-semibold text-lg pb-1 border-b-2`}
        >
          <Link to={`/profile/details`}>Profile</Link>
        </button>
      </div>
      <Outlet />
    </section>
  );
}
