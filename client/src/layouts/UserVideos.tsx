import React, { useEffect } from "react";
import GridVideos from "./GridVideos";
import axios from "../api/axios";
import { useAppSelector } from "../redux/hooks";
import { VideoCardProps } from "../utils/Constansts";

export default function UserVideos() {
  const { currentUser } = useAppSelector((state) => state.user);
  const [videos, setVideos] = React.useState<VideoCardProps[]>([]);
  useEffect(() => {
    const fetchUserVideo = async () => {
      try {
        const res = await axios.get(`/video/get/user/${currentUser?._id}`);
        setVideos(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserVideo();
  }, [currentUser]);
  return (
    <div>
      {videos.length === 0 ? (
        <h1 className="text-xl ml-3">You haven't uploaded any video</h1>
      ) : (
        <GridVideos videos={videos} />
      )}
    </div>
  );
}
