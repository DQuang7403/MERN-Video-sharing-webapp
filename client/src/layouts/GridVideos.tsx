import { Link, useNavigate } from "react-router-dom";
import TimeAgoFormatter from "../utils/TimeAgoFormatter";
// import DurationFormatter from "../utils/DurationFormatter";
import { GoClock } from "react-icons/go";
import { BiVolumeFull, BiVolumeMute } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import ViewFormatter from "../utils/ViewFormatter";
import axios from "../api/axios";
import { JSX } from "react/jsx-runtime";
import { ChannelType, VideoCardProps } from "../utils/Constansts";


type GridVideosProps = {
  videos: VideoCardProps[];
};
export default function GridVideos({ videos }: GridVideosProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
      {videos.map((video: JSX.IntrinsicAttributes & VideoCardProps) => {
        return <VideoCard key={video._id} {...video} />;
      })}
    </div>
  );
}

function VideoCard({
  _id,
  title,
  views,
  createdAt,
  thumbnailUrl,
  videoUrl,
  userId,
}: VideoCardProps) {
  const [videoIsPlaying, setVideoIsPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState<boolean>(true);
  const navigate = useNavigate();
  const muteIcon = muted ? (
    <BiVolumeMute
      onClick={() => setMuted(false)}
      className="text-lg flex-grow-1 pr-1.5 px-1 size-7 "
    />
  ) : (
    <BiVolumeFull
      onClick={() => setMuted(true)}
      className="text-lg flex-grow-1 pr-1.5 px-1 size-7 "
    />
  );
  const [channel, setChannel] = useState<ChannelType>({} as ChannelType);
  useEffect(() => {
    const fetchChannelInfo = async () => {
      const res = await axios.get(`user/find/${userId}`);
      setChannel(res.data);
    };
    fetchChannelInfo();
  }, [userId]);
  useEffect(() => {
    const video = videoRef.current;
    if (video === null) return;
    if (videoIsPlaying) {
      video.currentTime = 0;
    } else {
      video.pause();
    }
  }, [videoIsPlaying]);
  return (
    <div
      className="flex flex-col"
      onMouseEnter={() => setVideoIsPlaying(true)}
      onMouseLeave={() => setVideoIsPlaying(false)}
    >
      <div className="relative aspect-video">
        <Link to={`/watch?v=${_id}`}>
          <img
            loading="lazy"
            src={thumbnailUrl}
            className={`h-full w-full aspect-video object-cover trasition-[border-radius] transition-opacity duration-200 ${
              videoIsPlaying ? "rounded-sm " : "rounded-2xl"
            } ${
              videoIsPlaying && videoUrl.includes("mp4")
                ? "opacity-0 delay-300"
                : "opacity-100"
            }`}
          />
          {/* <div className="absolute bottom-2 right-2 bg-[rgba(0,0,0,0.8)] text-white px-1.5 rounded-md font-semibold text-sm ">
            {DurationFormatter(duration)}
          </div> */}
          <video
            ref={videoRef}
            className={`block h-full mx-auto rounded-sm object-cover absolute inset-0 transition-opacity duration-200 ${
              videoIsPlaying ? "opacity-100 delay-300" : "opacity-0"
            }`}
            playsInline
            muted={muted}
            src={videoUrl}
          ></video>
        </Link>

        <div
          className={`absolute top-2 right-2 bg-[rgba(0,0,0,0.7)] text-white trainsition-opacity duration-200 flex rounded-sm px-1 py-0.5 divide-x divide-primary-border z-50 ${
            videoIsPlaying ? "opacity-100 delay-300" : "opacity-0"
          }`}
        >
          {muteIcon}
          <GoClock className="text-lg flex-grow-1 pl-1.5 px-1 size-7" />
        </div>
      </div>
      <div className="flex">
        <Link
          to={`/channel/@${channel.username}`}
          className="z-[100] mr-3 mt-3 flex-shrink-0"
        >
          <img
            src={channel.profileUrl}
            loading="lazy"
            className="rounded-full size-9"
          />
        </Link>
        <div className="mt-3">
          <h3 className="font-semibold ">{title}</h3>
          <Link
            to={`/channel/@${channel.username}`}
            className="font-semibold text-secondary-text hover:text-primary-text z-[100]"
          >
            {channel.name}
          </Link>
          <p className="text-secondary-text">
            {ViewFormatter(views)} views • {TimeAgoFormatter(createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
