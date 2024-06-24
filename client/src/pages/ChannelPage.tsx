import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ChannelType, VideoCardProps } from "../utils/Constansts";
import axios from "../api/axios";
import { GoBell } from "react-icons/go";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { subcribe } from "../redux/userSlice";
import { useAxiosPrivate } from "../hooks/useAxiosPrivate";
import GridVideos from "../layouts/GridVideos";

export default function ChannelPage() {
  const { username } = useParams();
  const channelUsername = username?.slice(1);

  //hooks
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();

  //redux
  const { currentUser } = useAppSelector((state) => state.user);
  //state
  const [userDetail, setUserDetail] = useState<ChannelType>();
  const [videos, setVideos] = useState<VideoCardProps[]>([]);
  const [subcribed, setSubcribed] = useState<boolean>(false);

  //fetch channel details
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await axios.get(`/user/get/${channelUsername}`);
        setUserDetail(res.data);
        
      } catch (error) {
        console.error(error);
      }
    };

    fetchChannel();
  }, [username, subcribed]);
  //fetch all user's video after user detail is fetched
  useEffect(() => {
    const fetchUserVideo = async () => {
      try {
        const res = await axios.get(`/video/get/user/${userDetail?._id}`);
        setVideos(res.data);
        setSubcribed(findChannel());
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserVideo();
  }, [userDetail, username]);

  const findChannel = () => {
    const found = currentUser?.subscribedUsers.find(
      (user) => user.id === userDetail?._id,
    );
    return found ? true : false;
  };

  const handleSubcribe = async () => {
    try {
      findChannel()
        ? await axiosPrivate.put(`/user/unsub/${userDetail?._id}`)
        : await axiosPrivate.put(`/user/sub/${userDetail?._id}`, {
            name: userDetail?.name,
            profileUrl: userDetail?.profileUrl,
            username: userDetail?.username,
          });
      dispatch(
        subcribe({
          id: userDetail?._id,
          name: userDetail?.name,
          profileUrl: userDetail?.profileUrl,
          username: userDetail?.username,
        }),
      );
      setSubcribed(!subcribed);
    } catch (err) {
      console.error(err);
      navigate("/login", { state: { from: location }, replace: true });
    }
  };
  return (
    <section className="w-full flex-grow-1 overflow-auto min-h-[calc(100vh-64px)] md:px-20 px-2 py-8">
      <div className="w-full aspect-[7/1] min-h-40 mb-8 hidden md:block">
        {userDetail?.banner === "" ? (
          <div className="bg-primary w-full h-full rounded-lg " />
        ) : (
          <img
            src={`${userDetail?.banner}`}
            className="bg-primary w-full h-full rounded-lg object-cover"
            alt=""
          />
        )}
      </div>
      <div className=" flex items-center gap-4">
        <img src={userDetail?.profileUrl} className=" w-40 rounded-full" />
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
          <div>
            {subcribed ? (
              <button
                onClick={() => handleSubcribe()}
                className="bg-primary hover:bg-primary-hover px-3 py-1 rounded-full flex items-center gap-2"
              >
                <GoBell className="text-lg" /> Subcribed
              </button>
            ) : (
              <button
                onClick={() => handleSubcribe()}
                className=" bg-primary-red hover:bg-primary-red-hover px-3 py-1 rounded-full text-white"
              >
                Subcribe
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="my-8">
      <GridVideos videos={videos} /></div>
    </section>
  );
}
