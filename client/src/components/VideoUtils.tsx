import { useEffect, useState } from "react";
import { AiFillDislike, AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import axios from "../api/axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoBell } from "react-icons/go";
import { PiShareFatLight } from "react-icons/pi";
import { LiaDownloadSolid } from "react-icons/lia";
import { AiFillLike } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { dislike, like } from "../redux/videoSlice";
import { useAxiosPrivate } from "../hooks/useAxiosPrivate";
import { fetchChannelStart, fetchChannelSuccess } from "../redux/channelSlice";
import { subcribe } from "../redux/userSlice";
import { ToastContainer, toast } from "react-toastify";
import { defaultToast } from "../utils/Constansts";

function numberFormatter(num: number) {
  const formatter = new Intl.NumberFormat(undefined, {
    notation: "compact",
  });
  return formatter.format(num);
}

export default function VideoUtils({ ...videoDetails }) {
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAppSelector((state) => state.user);
  const { currentVideo } = useAppSelector((state) => state.video);
  const { channel } = useAppSelector((state) => state.channel);
  const [subscribed, setSubscribed] = useState<boolean>(false);

  const findChannel = () => {
    const found = currentUser?.subscribedUsers.find(
      (user) => user.id === channel?._id,
    );
    return found ? true : false;
  };
  useEffect(() => {
    const fetchChannelInfo = async () => {
      try {
        dispatch(fetchChannelStart());
        const res = await axios.get(`user/find/${videoDetails.userId}`);
        dispatch(fetchChannelSuccess(res.data));
        setSubscribed(findChannel());
      } catch (err) {
        console.error(err);
      }
    };
    fetchChannelInfo();
  }, [videoDetails.userId, subscribed, currentUser]);

  const handleSubcribe = async () => {
    try {
      findChannel()
        ? await axiosPrivate.put(`/user/unsub/${channel?._id}`)
        : await axiosPrivate.put(`/user/sub/${channel?._id}`, {
            name: channel?.name,
            profileUrl: channel?.profileUrl,
            username: channel?.username,
          });
      dispatch(
        subcribe({
          id: channel?._id,
          name: channel?.name,
          profileUrl: channel?.profileUrl,
          username: channel?.username,
        }),
      );
    } catch (err: any) {
      if (err.response.status === 403) {
        toast.error(err.response.data, defaultToast);
      } else {
        navigate("/login", { state: { from: location }, replace: true });
        toast.error("Something went wrong", defaultToast);
      }
    }
  };

  const handleLike = async () => {
    try {
      await axiosPrivate.put(`/user/like/${currentVideo?._id}`, {});
      dispatch(like(currentUser?._id));
    } catch (err) {
      console.error(err);
      navigate("/login", { state: { from: location }, replace: true });
    }
  };
  const handleDislike = async () => {
    try {
      await axiosPrivate.put(`/user/dislike/${currentVideo?._id}`);
    } catch (error) {
      console.error(error);
      navigate("/login", { state: { from: location }, replace: true });
    }
  };

  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <ToastContainer autoClose={5000} />
      <div className="flex mt-2 items-center sm:gap-5 gap-1 flex-grow">
        <Link to={`/channel/@${channel?.username}`}>
          <img src={channel?.profileUrl} className="w-10 rounded-full" />
        </Link>
        <div>
          <Link to={`/channel/@${channel?.username}`} className="font-semibold">
            {channel?.name}
          </Link>
          <p>{numberFormatter(channel?.subscribers || 0)} Subcriber</p>
        </div>
        <div className="max-[800px]:ml-auto">
          {subscribed ? (
            <button
              onClick={() => handleSubcribe()}
              className="bg-primary hover:bg-primary-hover  px-3 py-1 rounded-full flex items-center gap-2"
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
      <div className="flex items-center gap-3 max-[360px]:overflow-x-scroll hidden-scrollbar mt-2">
        <div className="flex items-center cursor-pointer ">
          <button
            onClick={() => handleLike()}
            className="flex items-center bg-primary gap-2 hover:bg-primary-hover px-3 py-1.5 rounded-l-full"
          >
            {videoDetails.likes?.includes(currentUser?._id) ? (
              <AiFillLike className="text-lg text-primary-text" />
            ) : (
              <AiOutlineLike className="text-lg" />
            )}
            <span className="text-sm">
              {numberFormatter(videoDetails.likes?.length)}
            </span>
          </button>
          <button
            onClick={() => handleDislike()}
            className=" px-3 py-1.5 rounded-r-full bg-primary hover:bg-primary-hover border-l-2 border-primary-dark"
          >
            {videoDetails.dislikes?.includes(currentUser?._id) ? (
              <AiFillDislike className="text-xl text-primary-text" />
            ) : (
              <AiOutlineDislike className=" text-xl" />
            )}
          </button>
        </div>
        <div className="flex items-center bg-primary cursor-pointer hover:bg-primary-hover px-3 py-1.5 rounded-full gap-2">
          <PiShareFatLight className=" text-lg" />
          <p className="text-sm">Share</p>
        </div>
        <div className="flex bg-primary cursor-pointer hover:bg-primary-hover px-3 py-1.5 rounded-full gap-2 items-center">
          <LiaDownloadSolid className=" text-lg" />
          <p className="text-sm">Download</p>
        </div>
      </div>
    </div>
  );
}
