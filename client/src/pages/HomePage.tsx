import { useEffect, useState } from "react";
import CategoryPills from "../components/CategoryPills";
import { VideoCardProps } from "../utils/Constansts";
import GridVideos from "../layouts/GridVideos";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axios";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setFilter } from "../redux/filterSlice";

export default function HomePage() {
  const { tag } = useAppSelector((state) => state.filter);
  const dispatch = useAppDispatch();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [categories, setCategories] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [videos, setVideos] = useState<VideoCardProps[]>([]);
  useEffect(() => {
    dispatch(setFilter(selectedCategory));
  }, [selectedCategory]);
  useEffect(() => {
    const fetchTrendingTags = async () => {
      try {
        const res = await axios.get("/video/trending/tags");
        setCategories(["All", ...res.data.tags]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTrendingTags();
  }, []);
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getVideos = async () => {
      try {
        const res =
        tag === "All"
            ? await axios.get("/video/random", {})
            : await axios.get(`/video/tags?tags=${tag}`, {
                signal: controller.signal,
              });

        isMounted && setVideos(res.data);
      } catch (error) {
        console.log(error);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getVideos();
    return () => {
      isMounted = false;
      isMounted && controller.abort();
    };
  }, [tag]);
  return (
    <div className="overflow-x-hidden sm:px-8 px-2 pb-4">
      <div className="sticky top-0 bg-primary-bg pb-4 z-[200]">
        <CategoryPills
          categories={categories}
          selected={selectedCategory}
          setSelected={setSelectedCategory}
        />
      </div>
      <GridVideos videos={videos} />
    </div>
  );
}
