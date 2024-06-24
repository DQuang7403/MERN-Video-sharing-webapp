import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TimeAgoFormatter from "../utils/TimeAgoFormatter";
import axios from "../api/axios";
import { useAppSelector } from "../redux/hooks";
import { useAxiosPrivate } from "../hooks/useAxiosPrivate";
import { FaUserCircle } from "react-icons/fa";
import { defaultToast } from "../utils/Constansts";
import { ToastContainer, toast } from "react-toastify";
type CommentType = {
  _id: string;
  videoId: string;
  userId: string;
  username: string;
  profilePic: string;
  comment: string;
  likes: string[];
  dislikes: string[];
  createAt: string;
  updateAt: string;
};
type CommentProps = {
  VideoId: string | null;
};
export default function Comment({ VideoId }: CommentProps) {
  const [comment, setComment] = useState("");
  const [disabled, setDisabled] = useState(comment.length !== 0);
  const [videoComments, setVideoComments] = useState<CommentType[]>([]);
  const axoisPrivate = useAxiosPrivate();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { currentUser } = useAppSelector((state) => state.user);

  useEffect(() => {
    setDisabled(comment.length === 0);
  }, [comment]);

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const res = await axios.get(`/comment/get/${VideoId}`);
        setVideoComments(res.data);
        
      } catch (error) {
        console.error(error);
        
      }
    };
    fetchComment();
  }, [VideoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    let isMounted = true;
    const controller = new AbortController();
    e.preventDefault();
    try {
      if(comment.length < 5){
        toast.error("Comment must be at least 5 characters", defaultToast);
        return
      }
      const res = await axoisPrivate.post(
        "/comment/add",
        {
          videoId: VideoId,
          userId: currentUser?._id,
          username: currentUser?.name,
          profilePic: currentUser?.profileUrl,
          comment,
        },
        {
          signal: controller.signal,
        },
      );
      console.log(res.data);
      toast.success("Comment added", defaultToast);
      isMounted && setComment("");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", defaultToast);
      navigate("/login", { state: { from: location }, replace: true });
    }
    return () => {
      isMounted = false;
      isMounted && controller.abort();
    };
  };

  return (
    <div className="col-span-2 sm:px-6 px-2 mt-8 ">
      <ToastContainer />

      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 flex-wrap">
          <div className="flex flex-grow">
            {currentUser?.profileUrl ? (
              <img
                src={`${currentUser?.profileUrl}`}
                className="w-10 rounded-full mr-4"
              />
            ) : (
              <FaUserCircle className="text-2xl mr-4" />
            )}

            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border-b-2 bg-inherit border-primary-border outline-none text-primary-text"
              placeholder="Add a comment"
            />
          </div>
          <button
            className="disabled:bg-primary bg-primary-blue hover:bg-primary-blue-hover px-4 py-1 rounded-full ml-auto"
            disabled={disabled}
          >
            Comment
          </button>
        </div>
      </form>
      <div className="flex flex-col gap-3 my-8">
        {videoComments.map((singleComment) => {
          return (
            <CommentBlock key={singleComment._id} comment={singleComment} />
          );
        })}
      </div>
    </div>
  );
}
function CommentBlock({ comment }: { comment: CommentType }) {
  return (
    <div className="flex ">
      <Link to={`/channel/@${comment.username}`} className="flex-shrink-0">
        <img src={`${comment.profilePic}`} className="w-10 rounded-full mr-4" />
      </Link>
      <div>
        <div className="flex gap-2 items-center text-primary-text flex-wrap">
          <Link
            to={`/channel/@${comment.username}`}
            className="text-secondary-text hover:text-secondary-text-hover"
          >
            @{comment.username.replace(/\s+/g, "")}
          </Link>
          <p>{TimeAgoFormatter(comment.createAt)}</p>
        </div>
        <div>{comment.comment}</div>
      </div>
    </div>
  );
}
//
