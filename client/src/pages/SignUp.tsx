import { Link, useNavigate } from "react-router-dom";
import YoutubeIcon from "../assets/YouTube_Icon.png";
import Button from "../components/Button";
import React, { useState } from "react";
import axios from "../api/axios";
export default function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pwd, setPwd] = useState("");
  const navigate = useNavigate();
  const signUpHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (email === "" || pwd === "" || name === "") return;
      if (pwd.length < 6) return;
      const res = await axios.post(
        `/auth/signup`,
        {
          name,
          email,
          pwd,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );
      console.log(res.data);
      setEmail("");
      setPwd("");
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <section className="bg-primary col-span-2 sm:col-span-1">
      <div className="bg-primary-bg flex flex-col sm:flex-row overflow-auto items-start max-w-[1100px] mx-auto px-6 py-14 xl:mt-28 xl:rounded-2xl max-xl:h-full">
        <div className="sm:pr-6 mb-6">
          <img src={YoutubeIcon} className="w-14" alt="" />
          <h1 className="text-4xl font-semibold sm:mt-6">
            Create a Youtube Account
          </h1>
          <h3 className="text-primary-text mt-4">
            Enter your email and password
          </h3>
        </div>
        <form
          onSubmit={signUpHandler}
          className="flex flex-col flex-grow sm:pl-6 gap-4 max-sm:w-full max-w-[480px]"
        >
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="name">Name: </label>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              className="border-primary-border border rounded-lg px-4 py-3 outline-none focus:border-blue-500 bg-inherit"
              name="name"
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="email">Email: </label>
            <input
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              className="border-primary-border border rounded-lg px-4 py-3 outline-none focus:border-blue-500 bg-inherit"
              name="email"
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              onChange={(e) => setPwd(e.target.value)}
              className="border-primary-border border rounded-lg px-4 py-3 outline-none focus:border-blue-500 bg-inherit"
              name="password"
            />
          </div>
          <div className="ml-auto mt-6 gap-2">
            <Button
              type="button"
              variant="ghost"
              size="auth"
              className=" text-blue-500  "
            >
              <Link to={"/login"}>Sign in</Link>
            </Button>
            <Button
              variant="ghost"
              size="auth"
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white "
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
