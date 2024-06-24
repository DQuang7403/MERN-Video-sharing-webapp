import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import axios from "../api/axios";
import { GoBell } from "react-icons/go";
import { useAxiosPrivate } from "../hooks/useAxiosPrivate";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { subcribe } from "../redux/userSlice";

export default function SubChannel() {
  const { currentUser } = useAppSelector((state) => state.user);
  return (
    <div className="pt-6 sm:mx-7 min-h-[calc(100vh-64px)] mx-2">
      {currentUser && currentUser.subscribedUsers.length > 0 ? (
        currentUser?.subscribedUsers.map((item) => (
          <ChannelBox key={item.id} channel={item} />
        ))
      ) : (
        <h1 className="text-center text-3xl font-bold">
          You haven't subscribed any channel
        </h1>
      )}
    </div>
  );
}
type ChannelBoxProps = {
  channel: {
    _id?: string;
    id?: string;
    name: string;
    profileUrl: string;
    username: string;
  };
};
type ChannelType = {
  _id: string;
  createdAt: string;
  email: string;
  name: string;
  profileUrl: string;
  subscribers: number;
  updatedAt: string;
  username: string;
};
export const ChannelBox = ({ channel }: ChannelBoxProps) => {
  const [userInfo, setUserInfo] = useState({} as ChannelType);
  const { currentUser } = useAppSelector((state) => state.user);
  const [subcribed, setSubcribed] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchChannelInfo = async () => {
      const res = await axios.get(`user/find/${channel.id}`);
      setUserInfo(res.data);
      setSubcribed(findChannel());
    };
    fetchChannelInfo();
  }, [channel]);
  const findChannel = () => {
    const found = currentUser?.subscribedUsers.find(
      (user) => user.id === channel?.id,
    );
    return found ? true : false;
  };
  const handleSubcribe = async () => {
    try {
      findChannel()
        ? await axiosPrivate.put(`/user/unsub/${channel?.id}`)
        : await axiosPrivate.put(`/user/sub/${channel?.id}`, {
            name: channel?.name,
            profileUrl: channel?.profileUrl,
            username: channel?.username,
          });
      dispatch(
        subcribe({
          id: channel?.id,
          name: channel?.name,
          profileUrl: channel?.profileUrl,
        }),
      );
      setSubcribed(!subcribed);
    } catch (err) {
      console.error(err);
      navigate("/login", { state: { from: location }, replace: true });
    }
  };

  return (
    <div className="flex items-center justify-center mb-4">
      <Link
        to={`/channel/@${userInfo.username}`}
        className="flex items-center justify-center"
      >
        <div className="sm:mx-10 mx-5">
          <img
            src={userInfo.profileUrl}
            className="min-w-20 w-32 rounded-full"
          />
        </div>
      </Link>
      <div className="flex items-center flex-wrap">
        <div className="min-w-[200px]">
          <h1 className="text-2xl font-bold">{userInfo.name}</h1>
          <h3 className="text-secondary-text text-sm">
            @{userInfo.name} • {userInfo.subscribers} subscribers
          </h3>
        </div>
        <button
          onClick={() => handleSubcribe()}
          className="hidden min-[450px]:flex bg-primary hover:bg-primary-hover px-3 py-1 rounded-full mt-2 items-center gap-2"
        >
          <GoBell className="text-lg" /> Subcribed
        </button>
      </div>
    </div>
  );
};
