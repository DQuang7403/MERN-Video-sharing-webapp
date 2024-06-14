import  { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ViewFormatter from "../utils/ViewFormatter";
import TimeAgoFormatter from "../utils/TimeAgoFormatter";
import axios from "../api/axios";

type VideoCardProps = {
  _id: string;
  title: string;
  description: string;
  views: number;
  thumbnailUrl: string;
  createdAt: string;
  videoUrl: string;
  userId: string;
};
type ChannelDetails = {
  name: string;
  profileUrl: string;
  subscribers: number;
  _id: string;
  username: string;
};
export default function LargeVideo({ ...videoDetail }: VideoCardProps) {
  const [channelDetails, setChannelDetails] = useState<ChannelDetails>(
    {} as any,
  );
  useEffect(() => {
    const fetchChannelDetails = async () => {
      try {
        const res = await axios.get("/user/find/" + videoDetail.userId);
        setChannelDetails(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchChannelDetails();
  }, []);

  return (
    <Link
      to={`/watch?v=${videoDetail._id}`}
      className="flex items-center gap-3 max-w-[820px]"
    >
      <div className="max-w-60 min-[450px]:mx-auto">
        <img
          src={videoDetail.thumbnailUrl}
          alt=""
          loading="lazy"
          className="aspect-video rounded-2xl min-w-60 "
        />
      </div>
      <div className="min-[450px]:flex flex-col hidden">
        <h2 className="text-lg font-semibold line-clamp-2">
          {videoDetail.title}
        </h2>
        <div className="text-sm flex items-center flex-wrap ">
          <Link
            to={`/channel/@${channelDetails.username}`}
            className="text-secondary-text font-semibold text-sm mr-2"
          >
            {channelDetails.name}
          </Link>
          <div className="flex gap-1 text-secondary-text">
            <h3>{ViewFormatter(videoDetail.views)} views</h3>
            <span>•</span>
            <h3>{TimeAgoFormatter(videoDetail.createdAt)}</h3>
          </div>
        </div>
        <div className="line-clamp-2 text-secondary-text mt-3 text-sm">
          {videoDetail.description}
        </div>
      </div>
    </Link>
  );
}
