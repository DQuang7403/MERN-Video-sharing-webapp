import React, { FormEvent, useEffect, useState } from "react";
import Input from "../components/Input";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import TimeAgoFormatter from "../utils/TimeAgoFormatter";
import { MdChangeCircle } from "react-icons/md";
import Button from "../components/Button";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useAxiosPrivate } from "../hooks/useAxiosPrivate";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { defaultToast } from "../utils/Constansts";
import { setAuth } from "../redux/userSlice";
import { useRefresh } from "../hooks/useRefresh";

export default function UserDetails() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profileUrl, setProfileUrl] = useState<File | undefined | string>(
    undefined,
  );
  const [pwd, setPwd] = useState("");
  const [banner, setBanner] = useState<File | undefined | string>(undefined);
  const [uploadTypeFile, setUploadTypeFile] = useState({
    ProfileUrl: false,
    Banner: false,
  });
  const { currentUser } = useAppSelector((state) => state.user);
  const axiosPrivate = useAxiosPrivate();
  const uploadFile = (file: any, type: string) => {
    const storage = getStorage();
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, `${type}/${fileName}`);
    if (!file) return;
    const metadata = {
      contentType: file.type,
    };

    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
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
          if (type === "ProfileUrl") {
            setProfileUrl(downloadURL);
            setUploadTypeFile((prev) => {
              return { ...prev, ProfileUrl: false };
            });
          } else {
            setBanner(downloadURL);
            setUploadTypeFile((prev) => {
              return { ...prev, Banner: false };
            });
          }
        });
      },
    );
  };
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setUsername(currentUser.username);
      setEmail(currentUser.email);
      setProfileUrl(currentUser.profileUrl);
      setBanner(currentUser.banner);
    }
  }, [currentUser]);
  useEffect(() => {
    if (uploadTypeFile.ProfileUrl === true) {
      uploadFile(profileUrl, "ProfileUrl");
    }
  }, [profileUrl]);
  useEffect(() => {
    if (uploadTypeFile.Banner === true) {
      uploadFile(banner, "Banner");
    }
  }, [banner]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let isMounted = true;
    const controller = new AbortController();
    if (pwd !== "" && pwd.length < 6) {
      toast.error("Password must be at least 6 characters", defaultToast);
      return;
    }
    try {
      const res = await axiosPrivate.put(
        `/user/update/${currentUser?._id}`,
        {
          name,
          username,
          email,
          banner,
          profileUrl,
          pwd,
        },
        {
          signal: controller.signal,
        },
      );
      
      if (res.status === 200) {
        toast.success("User updated", defaultToast);
      } else {
        toast.error("Something went wrong", defaultToast);
      }
    } catch (error) {
      console.error(error);
    }
    return () => {
      isMounted = false;
      isMounted && controller.abort();
    };
  };
  return (
    <form onSubmit={onSubmit} className="flex flex-col">
      <ToastContainer autoClose={5000}/>
      <h1 className="text-3xl font-semibold">User Details</h1>
      <h2 className="text-secondary-text">
        Last updated: {currentUser && TimeAgoFormatter(currentUser.updatedAt)}
      </h2>
      <h2 className="text-secondary-text">
        Created: {currentUser && TimeAgoFormatter(currentUser.createdAt)}
      </h2>
      <div className="grid md:grid-cols-2 gap-4 grid-cols-1">
        <div>
          <label htmlFor="name">Name</label>
          <Input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <Input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <Input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="profileUrl">Profile Image</label>
          <div className="flex items-center">
            <Input
              type={`${uploadTypeFile.ProfileUrl ? "file" : "text"}`}
              name="profileFile"
              value={
                uploadTypeFile.ProfileUrl
                  ? ""
                  : typeof profileUrl === "string"
                  ? profileUrl
                  : undefined
              }
              accept={`${uploadTypeFile.ProfileUrl ? "image/*" : ""}`}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files.length > 0) {
                  uploadTypeFile.ProfileUrl && setProfileUrl(e.target.files[0]);
                } else if (!uploadTypeFile.ProfileUrl) {
                  setProfileUrl(e.target.value);
                }
              }}
            />
            <button
              type="button"
              onClick={() =>
                setUploadTypeFile({
                  ...uploadTypeFile,
                  ProfileUrl: !uploadTypeFile.ProfileUrl,
                })
              }
            >
              <MdChangeCircle className="text-2xl ml-2" />
            </button>
          </div>
        </div>
        {currentUser && !currentUser.signWithGoogle && (
          <div>
            <label htmlFor="pwd">Set New Password</label>
            <Input
              type="password"
              name="pwd"
              onChange={(e) => setPwd(e.target.value)}
              onFocus={(e) => (e.target.type = "text")}
              onBlur={(e) => (e.target.type = "password")}
            />
          </div>
        )}
        <div>
          <label htmlFor="banner">Banner Image</label>
          <div className="flex items-center">
            <Input
              type={`${uploadTypeFile.Banner ? "file" : "text"}`}
              name="banner"
              value={
                uploadTypeFile.Banner
                  ? ""
                  : typeof banner === "string"
                  ? banner
                  : undefined
              }
              accept={`${uploadTypeFile.Banner ? "image/*" : ""}`}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  uploadTypeFile.Banner && setBanner(e.target.files[0]);
                } else if (!uploadTypeFile.Banner) {
                  setBanner(e.target.value);
                }
              }}
            />
            <button
              type="button"
              onClick={() =>
                setUploadTypeFile({
                  ...uploadTypeFile,
                  Banner: !uploadTypeFile.Banner,
                })
              }
            >
              <MdChangeCircle className="text-2xl ml-2" />
            </button>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="auth"
        className="bg-blue-600 hover:bg-blue-700 text-white mt-4 ml-auto"
      >
        Save
      </Button>
    </form>
  );
}
