import Navbar from "./layouts/Navbar";
import SideBar from "./layouts/SideBar";
import HomePage from "./pages/HomePage";
import useSidebarContext from "./contexts/SidebarContext";
import { Route, Routes } from "react-router-dom";
import Watch from "./pages/Watch";
import ExplorePage from "./pages/ExplorePage";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { useAppSelector } from "./redux/hooks";
import { useEffect } from "react";
import { useRefresh } from "./hooks/useRefresh";
import Subcription from "./pages/Subscription";
import SubChannel from "./pages/SubChannel";
import ChannelPage from "./pages/ChannelPage";

import PrivateRoute from "./utils/PrivateRoute";
import UploadiPage from "./pages/UploadPage";
import LikedVideos from "./pages/LikedVideos";
import UserProfile from "./layouts/UserProfile";
import GridVideos from "./layouts/GridVideos";
import UserVideos from "./layouts/UserVideos";
import UserDetails from "./layouts/UserDetails";
import SearchResults from "./layouts/SearchResults";
function App() {
  function ToggleTheme() {
    if (document.documentElement.dataset.theme === "dark") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.dataset.theme = "dark";
    }
  }
  const { isWatchRoute } = useSidebarContext();
  const { token } = useAppSelector((state) => state.user);
  const refresh = useRefresh();
  useEffect(() => {
    const expires = 1000 * 60 * 15;
    const verifyRefreshToken = async () => {
      if (token) {
        try {
          await refresh();
          console.log("refresh");
        } catch (err) {
          console.log(err);
        }
      }
    };
    setTimeout(() => {
      verifyRefreshToken();
    }, expires);
  }, [token]);

  return (
    <div className="max-h-screen flex flex-col bg-primary-bg text-primary-text">
      <Navbar ToggleTheme={ToggleTheme} />
      <div
        className={`grid ${
          !isWatchRoute && "sm:grid-cols-[auto,1fr] grid-cols-1"
        } flex-grow-1 overflow-auto`}
      >
        <SideBar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/channel/:username" element={<ChannelPage />} />

          <Route path="/watch" element={<Watch />}></Route>
          <Route path="/explore/:category" element={<ExplorePage />}></Route>

          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/results" element={<SearchResults />}></Route>

          {/* Private routes */}
          <Route path="/feed/">
            <Route
              path="subscription"
              element={
                <PrivateRoute>
                  <Subcription />
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="channel"
              element={
                <PrivateRoute>
                  <SubChannel />
                </PrivateRoute>
              }
            ></Route>
          </Route>
          <Route
            path="/upload"
            element={
              <PrivateRoute>
                <UploadiPage />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/like"
            element={
              <PrivateRoute>
                <LikedVideos />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          >
            <Route path="" element={<UserVideos />}></Route>
            <Route path="details" element={<UserDetails />}></Route>
          </Route>
          <Route
            path="*"
            element={
              <div className="text-3xl text-center my-auto">Coming soon!!!</div>
            }
          ></Route>
        </Routes>
      </div>  
    </div>
  );
}

export default App;
