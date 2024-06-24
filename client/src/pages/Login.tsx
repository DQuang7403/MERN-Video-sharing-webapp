import { Link, useLocation, useNavigate } from "react-router-dom";
import YoutubeIcon from "../assets/YouTube_Icon.png";
import { FcGoogle } from "react-icons/fc";
import Button from "../components/Button";
import React, { useState } from "react";
import axios from "../api/axios";
import { loginFailure, loginStart, setAuth } from "../redux/userSlice";
import { useAppDispatch } from "../redux/hooks";

import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { defaultToast } from "../utils/Constansts";
export default function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const loginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axios.post(
        "/auth/signin",
        {
          email,
          pwd,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );
      dispatch(setAuth(res.data));
      setEmail("");
      setPwd("");
      navigate(from, { replace: true });
    } catch (err) {
      dispatch(loginFailure());
      toast.error("Login Failed! Please check your credentials", defaultToast);
    }
  };
  const LoginWithGoogle = async (result: any) => {
    dispatch(loginStart());
    try {
      const res = await axios.post(
        "/auth/google",
        {
          name: result.user.displayName,
          email: result.user.email,
          profileUrl: result.user.photoURL,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );
      dispatch(setAuth(res.data));
      navigate(from, { replace: true });
    } catch (error: any) {
      if (error.response.status === 400) {
        console.log("User already exists with username and password");
        toast.error("User already exists with username and password", defaultToast);
      }
      dispatch(loginFailure());
    }
  };

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
        LoginWithGoogle(result);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Login Failed", defaultToast);
      });
  };
  return (
    <section className="bg-primary col-span-2 sm:col-span-1">
      <ToastContainer autoClose={5000}/>
      <div className="bg-primary-bg flex flex-col sm:flex-row overflow-auto items-start max-w-[1000px] mx-auto px-6 py-14 xl:mt-28 xl:rounded-2xl max-xl:h-full">
        <div className="sm:pr-6 mb-6 flex-grow">
          <img src={YoutubeIcon} className="w-14" alt="" />
          <h1 className="text-4xl font-semibold sm:mt-6">Sign in</h1>
          <h3 className="text-primary-text mt-4">to continue to YouTube</h3>
        </div>
        <form
          onSubmit={loginSubmit}
          className="flex flex-col flex-grow sm:pl-6 gap-4 max-sm:w-full max-w-[480px]"
        >
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="email">Email: </label>
            <input
              type="text"
              className="border-primary-border border rounded-lg px-4 py-3 outline-none focus:border-blue-500 bg-inherit"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="border-primary-border border rounded-lg px-4 py-3 outline-none focus:border-blue-500 bg-inherit"
              name="password"
              onChange={(e) => setPwd(e.target.value)}
            />
          </div>
          <div className="ml-auto mt-6 flex flex-col md:flex-row gap-2">
            <Button
              type="button"
              variant="ghost"
              size="auth"
              className=" text-blue-500 "
            >
              <Link to={"/signup"}>Create account</Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="auth"
              className="border border-primary-border flex items-center gap-2 "
              onClick={signInWithGoogle}
            >
              <FcGoogle className="text-2xl" />
              Sign in with Google
            </Button>
            <Button
              variant="ghost"
              size="auth"
              className="bg-blue-600 hover:bg-blue-700 text-white  "
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
