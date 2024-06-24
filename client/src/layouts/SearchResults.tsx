import React, { useEffect, useState } from "react";
import useQuery from "../hooks/useQuery";
import axios from "../api/axios";
import LargeVideo from "../components/LargeVideo";
import { ChannelType, VideoCardProps } from "../utils/Constansts";
import { ChannelBox } from "../pages/SubChannel";



export default function SearchResults() {
  const query = useQuery();
  const searchInput = query.get("search_query");
  const [resultVideos, setResultVideos] = useState<VideoCardProps[]>([]);
  const [resultUsers, setResultUsers] = useState<ChannelType[]>([]);
  useEffect(() => {
    const fetchResults = async () => {
      if (searchInput === null) return;
      try {
        const res = await axios.get(`/video/search`, {
          params: { query: searchInput },
        });
        setResultVideos(res.data.videos);
        setResultUsers(res.data.users);
        console.log(res.data.users, res.data.videos);
      } catch (error) {
        console.error(error);
      }
    };
    fetchResults();
  }, [searchInput]);
  return (
    <div className="px-1 pt-6 md:px-6 lg:px-20 overflow-auto grid-cols-1 ">
      {resultVideos &&
        resultVideos.map((video) => {
          return <LargeVideo key={video._id} {...video} />;
        })}

      {resultUsers &&
        resultUsers.map((user) => <ChannelBox key={user._id} channel={user} />)}
    </div>
  );
}
