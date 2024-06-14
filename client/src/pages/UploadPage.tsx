import { FormEvent, useEffect, useState } from "react";
import Button from "../components/Button";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { unstable_usePrompt, useNavigate } from "react-router-dom";
import { useAxiosPrivate } from "../hooks/useAxiosPrivate";
type UploadedType = {
  videoUrl: boolean;
  thumbnailUrl: boolean;
};
export default function UploadPage() {
  const [video, setVideo] = useState<File | undefined>(undefined);
  const [thumbnail, setThumbnail] = useState<File | undefined>(undefined);
  const [videoUploadPercentage, setVideoUploadPercentage] = useState(0);
  const [thumbnailUploadPercentage, setThumbnailUploadPercentage] = useState(0);
  const [input, setInput] = useState({});
  const [uploaded, setUploaded] = useState<UploadedType>({
    videoUrl: false,
    thumbnailUrl: false,
  });
  const [tags, setTags] = useState<string[]>([]);


  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  // Block navigating elsewhere when data has been entered into the input
  // unstable_usePrompt({
  //   message: "Are you sure?",
  //   when: ({ currentLocation, nextLocation }) =>
  //     input !== "" &&
  //     currentLocation.pathname !== nextLocation.pathname,
  // });

  const formatString = (str: string) => {
    let inputString = str.trim();
    const array = inputString.split(",");
    setTags(array.map((item) => item.trim()));
  };
  const handleInputChange = (e: any) => {
    setInput((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const handleVideoUpload = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await axiosPrivate.post(`/video/add`, {
        ...input,
        tags,
      });
      if (res.status === 200) {
        navigate(`/watch?v=${res.data._id}`);
        console.log(res.data._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const uploadFile = (file: any, type: string) => {
    const storage = getStorage();
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);  
    if (!file) return;
    if (uploaded.thumbnailUrl === false || uploaded.videoUrl === false) {
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (type === "videoUrl") {
            setVideoUploadPercentage(Math.round(progress));
          } else {
            setThumbnailUploadPercentage(Math.round(progress));
          }
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              break;
            default:
              break;
          }
        },
        (error) => {
          console.error(error);
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setInput((prev) => {
              return { ...prev, [type]: downloadURL };
            });
            setUploaded((prev) => {
              console.log(prev);
              return { ...prev, [type]: true };
            });
            console.log(uploaded);
          });
        },
      );
    } else {
      console.log("Already uploaded");
    }
  };
  useEffect(() => {
    video && uploadFile(video, "videoUrl");
  }, [video]);
  useEffect(() => {
    thumbnail && uploadFile(thumbnail, "thumbnailUrl");
  }, [thumbnail]);
  useEffect(() => {
    console.log(uploaded);
  });
  return (
    <section className="w-full flex-grow-1 overflow-auto min-h-[calc(100vh-64px)]  px-8">
      <h1 className="text-3xl font-bold py-4">Upload your video</h1>
      <form onSubmit={handleVideoUpload} className="flex flex-col">
        <label htmlFor="video" className="my-2 text-lg ml-4">
          Video{" "}
        </label>
        <div className="border p-3 focus:border-primary-blue rounded-md outline-none border-primary-border">
          {videoUploadPercentage > 0 && (
            <p className="mb-2">
              {"Upload is " + videoUploadPercentage + "% done"}
            </p>
          )}
          <input
            type="file"
            id="video"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setVideo(e.target.files[0]);
              }
            }}
            accept="video/*"
            required
          />
        </div>

        <label htmlFor="thumbnail" className="my-2 text-lg ml-4">
          Thumbnail
        </label>
        <div className="border p-3 focus:border-primary-blue rounded-md outline-none border-primary-border">
          {thumbnailUploadPercentage > 0 && (
            <p className="mb-2">
              {"Upload is " + thumbnailUploadPercentage + "% done"}
            </p>
          )}
          <input
            type="file"
            id="thumbnail"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setThumbnail(e.target.files[0]);
              }
            }}
            required
            accept="image/*"
          />
        </div>

        <label htmlFor="video_title" className="my-2 text-lg ml-4">
          Title
        </label>
        <input
          required
          type="text"
          name="title"
          onChange={handleInputChange}
          id="video_title"
          className="border p-3 focus:border-primary-blue rounded-md outline-none bg-transparent border-primary-border"
        />
        <label htmlFor="video_description" className="my-2 text-lg ml-4">
          Description
        </label>
        <textarea
          rows={5}
          required
          name="description"
          onChange={handleInputChange}
          id="video_description"
          className="border p-3 focus:border-primary-blue outline-none rounded-md bg-transparent border-primary-border"
        />
        <label htmlFor="video_tags" className="my-2 text-lg ml-4">
          Tags
        </label>
        <input
          required
          placeholder="tag1, tag2, tag3"
          type="text"
          onChange={(e) => {
            formatString(e.target.value);
          }}
          id="video_tags"
          className="border p-3 focus:border-primary-blue rounded-md outline-none bg-transparent border-primary-border"
        />
        <Button
          variant="ghost"
          size="auth"
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white w-32 my-4 ml-auto"
        >
          Upload
        </Button>
      </form>
    </section>
  );
}
