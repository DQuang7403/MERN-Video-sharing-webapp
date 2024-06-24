import { useEffect, useState } from "react";
import CategoryPills from "../components/CategoryPills";
import { VideoCardProps, categories } from "../utils/Constansts";
import TimeAgoFormatter from "../utils/TimeAgoFormatter";
import { Link } from "react-router-dom";
import DurationFormatter from "../utils/DurationFormatter";
import axios from "../api/axios";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setFilter } from "../redux/filterSlice";
const VIEW_FORMATER = new Intl.NumberFormat("en-US", { notation: "compact" });

type RelatedVideoCardProps = {
  id?: string;
  tags?: string[];
};
export default function RelatedVideos({ id, tags }: RelatedVideoCardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0],
  );
  const { tag } = useAppSelector((state) => state.filter);
  const dispatch = useAppDispatch();
  const [videos, setVideos] = useState<VideoCardProps[]>([]);
  const fomattedTags = tags?.map((tag) => `${tag}`).join(",");

  useEffect(() => {
    dispatch(setFilter(selectedCategory));
  }, [selectedCategory]);
  useEffect(() => {
    const fetchRelatedVideos = async () => {
      try {
        const res =
          tag === "All"
            ? await axios.get(`video/tags?tags=${fomattedTags}`)
            : await axios.get(`video/tags?tags=${tag}`);
        setVideos(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRelatedVideos();
  }, [id, tag]);
  return (
    <div className="row-span-2 col-span-2 lg:col-span-1 sm:px-6 px-2">
      <CategoryPills
        categories={["All", ...(tags || [])]}
        selected={selectedCategory}
        setSelected={setSelectedCategory}
      />
      <div className="flex flex-col gap-3">
        {videos.length > 0 ? (
          videos.map((video) => {
            return <RelatedVideoCard key={video._id} {...video} />;
          })
        ) : (
          <p className="text-center text-lg">No related videos </p>
        )}
      </div>
    </div>
  );
}

type ChannelProps = {
  id: string;
  name: string;
  profileUrl: string;
  subscribers: number;
  createdAt: string;
};
function RelatedVideoCard({ ...videoDetails }: VideoCardProps) {
  const [channel, setChannel] = useState<ChannelProps>({
    name: "",
    profileUrl: "",
    id: "",
    subscribers: 0,
    createdAt: "",
  });
  useEffect(() => {
    const fetchChannelInfo = async () => {
      const res = await axios.get(`user/find/${videoDetails.userId}`);
      setChannel(res.data);
    };
    fetchChannelInfo();
  }, [videoDetails.userId]);
  return (
    <Link
      to={`/watch?v=${videoDetails._id}`}
      className="flex items-center gap-2 "
    >
      <div className="w-40 relative">
        <img
          className=" object-cover rounded-lg aspect-video"
          src={videoDetails.thumbnailUrl}
        />
        {/* <div className="absolute bottom-1 right-1 text-white px-1 text-xs rounded bg-[rgba(0,0,0,0.8)]">
          {DurationFormatter(videoDetails.duration)}
        </div> */}
      </div>
      <div className="flex flex-col w-56 font-semibold">
        <div className="line-clamp-2 text-primary-text">
          {videoDetails.title}
        </div>
        <h3 className="text-xs text-secondary-text">{channel.name}</h3>
        <div className="text-xs text-secondary-text ">
          {VIEW_FORMATER.format(videoDetails.views)} views •{" "}
          {TimeAgoFormatter(channel.createdAt)}
        </div>
      </div>
    </Link>
  );
}
