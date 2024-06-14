import { useParams } from "react-router-dom";
import TredingIcon from "../assets/TrendingIcon.png";
import SportIcon from "../assets/SportIcon.jpg";
import GamingIcon from "../assets/GamingIcon.jpg";
import MusicIcon from "../assets/MusicIcon.jpg";
import LargeVideo from "../components/LargeVideo";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { VideoCardProps } from "../utils/Constansts";

export default function ExplorePage() {
  const { category } = useParams();
  const [videos, setVideos] = useState<VideoCardProps[]>([]);
  const icons: { [key: string]: string } = {
    trending: TredingIcon,
    sports: SportIcon,
    gaming: GamingIcon,
    music: MusicIcon,
  };
  const icon = icons[category || ""];
  useEffect(() => {
    const fetchTrendingVideos = async () => {
      try {
        const res = await axios.get("video/trending");
        setVideos(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchExploreVideo = async () => {
      try {
        const res = await axios.get(`/video/tags?tags=${category}`);
        setVideos(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (category === "trending") {
      fetchTrendingVideos();
    } else {
      fetchExploreVideo();
    }
  }, [category]);
  return (
    <section className="px-1 pt-6 md:px-6 lg:px-20 overflow-auto grid-cols-1">
      <div className="flex items-center gap-4 mb-7 pl-8 border-b border-primary-border pb-5">
        {category !== "news" && (
          <img src={icon} className="w-16 rounded-full" />
        )}
        <h1 className="text-3xl font-bold capitalize">{category}</h1>
      </div>
      <div className="flex flex-col gap-4">
        {videos.map((video) => {
          return <LargeVideo key={video._id} {...video} />;
        })}
      </div>
    </section>
  );
}
