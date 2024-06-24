import { useEffect, useState } from "react";
import useQuery from "../hooks/useQuery";
import TimeAgoFormatter from "../utils/TimeAgoFormatter";
import Comment from "../layouts/Comment";
import ViewFormatter from "../utils/ViewFormatter";
import axios from "../api/axios";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchVideoError,
  fetchVideoStart,
  fetchVideoSuccess,
} from "../redux/videoSlice";
import VideoUtils from "../components/VideoUtils";
import RelatedVideos from "../layouts/Recomendation";
import { ToastContainer } from "react-toastify";

export default function Watch() {
  const query = useQuery();
  const videoId = query.get("v");
  const dispatch = useAppDispatch();
  const { currentVideo } = useAppSelector((state) => state.video);

  useEffect(() => {
    dispatch(fetchVideoStart());
    const fetchVideoById = async () => {
      try {
        const res = await axios.get(`video/get/${videoId}`);
        dispatch(fetchVideoSuccess(res.data));
      } catch (err) {
        dispatch(fetchVideoError());
      }
    };
    fetchVideoById();
    let isMounted = true;
    const controller = new AbortController();
    const viewIncrease = async () => {
      try {
        await axios.put(`/video/view/${videoId}`, {
          signal: controller.signal,
        });
      } catch (error) {
        console.error(error);
      }
    };
    setTimeout(() => {
      if (isMounted) {
        viewIncrease();
      }
    }, 5000);

    return () => {
      isMounted = false;
      isMounted && controller.abort();
    };
  }, [query.get("v")]);

  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 overflow-auto lg:mt-6 w-full">
      <div className="sm:px-6 px-2 col-span-2 ">
        {currentVideo?.videoUrl?.includes("youtube") ? (
          <iframe
            aria-controls="player"
            className="aspect-video rounded-lg object-cover w-full"
            src={`${currentVideo.videoUrl}/?autoplay=1`}
          ></iframe>
        ) : (
          <video
            controls
            autoPlay
            className="aspect-video rounded-lg w-full"
            src={currentVideo?.videoUrl}
          ></video>
        )}
        <div>
          <h2 className="lg:text-2xl text-lg font-semibold mt-2">
            {currentVideo?.title}
          </h2>
          <VideoUtils {...currentVideo} />
          <Decripstion {...currentVideo} />
        </div>
      </div>
      <RelatedVideos id={currentVideo?._id} tags={currentVideo?.tags} />
      <Comment VideoId={videoId}/>
    </div>
  );
}

function Decripstion({ ...videoDetails }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div
      className={`bg-primary mt-4 w-full p-3 rounded-lg ${
        isOpen ? "" : "cursor-pointer"
      }`}
      onClick={() => {
        !isOpen && setIsOpen(!isOpen);
      }}
    >
      <div className="font-semibold mb-3">
        {ViewFormatter(videoDetails.views)} Views{" "}
        {TimeAgoFormatter(videoDetails.createdAt)}
      </div>
      <div className={`${isOpen ? "block" : "line-clamp-2"}`}>
        {videoDetails.description}
      </div>
      {isOpen && (
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="font-bold mt-4 hover:cursor-pointer w-12"
        >
          Hide
        </div>
      )}
    </div>
  );
}
