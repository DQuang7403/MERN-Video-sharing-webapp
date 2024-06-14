import { useEffect, useState } from "react";
import { MdOutlineMenu } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { TbSunMoon } from "react-icons/tb";
import { RiVideoAddLine } from "react-icons/ri";
import { IoSearch } from "react-icons/io5";
import logo from "../assets/YouTube_Icon.png";
import Button from "../components/Button";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import useSidebarContext from "../contexts/SidebarContext";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/userSlice";
type NavbarProps = {
  ToggleTheme: () => void;
};
export default function Navbar({ ToggleTheme }: NavbarProps) {
  const [showSearchBar, setShowSearchBar] = useState<Boolean>(false);
  const { currentUser } = useAppSelector((state) => state.user);
  const [showMenu, setShowMenu] = useState<Boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const handle = () => {
      if (window.innerWidth > 768) {
        setShowSearchBar(false);
      }
    };
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  });
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  return (
    <div
      className={`flex sm:gap-10 lg:gap-20 justify-between pt-2 mb-3 mx-4 items-center`}
    >
      <NavbarFirstSection showSearchBar={showSearchBar} />
      <div
        className={`flex-shrink-0 flex-grow justify-center sm:gap-4 ${
          showSearchBar ? "flex" : "hidden md:flex"
        }`}
      >
        {showSearchBar && (
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => setShowSearchBar(false)}
          >
            <IoMdArrowRoundBack className="text-2xl " />
          </Button>
        )}
        <div className="flex flex-grow max-w-[600px] w-full overflow-hidden">
          <input
            type="search"
            placeholder="Search"
            className="sm:w-full rounded-l-full border border-primary-border bg-primary-bg py-1 px-4 focus:border-blue-500 outline-none"
          />
          <Button className="py-2 px-4 rounded-r-full border-primary-border border border-l-0 flex-shrink-0">
            <IoSearch className="text-2xl" />
          </Button>
        </div>
      </div>
      <div
        className={`items-center flex-shrink-0 md:gap-2 ${
          showSearchBar ? "hidden" : "flex"
        }`}
      >
        <Button
          variant="ghost"
          size={"icon"}
          className="flex md:hidden"
          onClick={() => setShowSearchBar(true)}
        >
          <IoSearch className="text-2xl" />
        </Button>
        <Button variant="ghost" size={"icon"} onClick={() => ToggleTheme()}>
          <TbSunMoon className="text-2xl" />
        </Button>
        {currentUser === null ? (
          <Link
            to={"/login"}
            className="border-2 border-primary-blue rounded-full px-2 py-1 text-primary-blue hover:bg-primary-hover"
            type="button"
          >
            Sign In
          </Link>
        ) : (
          <div className="flex items-center md:gap-2 ">
            <Button variant="ghost" size={"icon"} className="hidden sm:flex">
              <Link to={"/upload"}>
                <RiVideoAddLine className="text-2xl" />
              </Link>
            </Button>
            <div className="relative">
              <button
                data-tooltip={`${currentUser?.name}`}
                onClick={() => setShowMenu(!showMenu)}
                className={`${!showMenu && "tooltip"} size-8`}
              >
                {!currentUser?.profileUrl ? (
                  <FaUserCircle className="text-2xl" />
                ) : (
                  <img
                    src={currentUser?.profileUrl}
                    className="w-full rounded-full"
                  />
                )}
              </button>
              <ul className={`${showMenu ? "dropdown-menu" : "hidden"}`}>
                <div className="p-2 border-b border-primary-border mb-2">
                  <h3 className="text-lg font-semibold">{currentUser.name}</h3>
                  <p>{currentUser.email}</p>
                </div>
                <li>
                  <Link to="/profile" className="dropdown-item">
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleLogout()}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
type NavbarFirstSectionProps = {
  showSearchBar: Boolean;
};
export const NavbarFirstSection = ({
  showSearchBar,
}: NavbarFirstSectionProps) => {
  const { toggle } = useSidebarContext();
  return (
    <div
      className={`flex  items-center sm:gap-2 flex-shrink-0 ${
        showSearchBar ? "hidden" : "flex"
      }`}
    >
      <Button variant={"ghost"} size={"icon"} onClick={toggle}>
        <MdOutlineMenu className="text-2xl" />
      </Button>

      <Link to="/" className="flex items-center">
        <img src={logo} className="h-11" />
        <span className="text-lg font-semibold">YouTube</span>
      </Link>
    </div>
  );
};
