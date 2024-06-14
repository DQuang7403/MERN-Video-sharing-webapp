import { useEffect, useState } from "react";
import { useAxiosPrivate } from "../hooks/useAxiosPrivate";
import GridVideos from "../layouts/GridVideos";

export default function LikedVideos() {
  const [likedVideos, setLikedVideos] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    const fetchLikedVideo = async () => {
      const res = await axiosPrivate.get("/video/like");
      setLikedVideos(res.data);
    };
    fetchLikedVideo();
  }, []);
  return (
    <section className="w-full flex-grow-1 overflow-auto min-h-[calc(100vh-64px)] md:px-20 px-2 ">
      <h2 className="text-xl my-8 font-semibold">Liked Video</h2>
      <GridVideos videos={likedVideos} />
    </section>
  );
}
