import { IconType } from "react-icons/lib";
import { Link } from "react-router-dom";
import {
  exploreItem,
  mainMenuItem,
  personalItem,
  sidebarSmall,
} from "../utils/Constansts";
import { Children, useState } from "react";
import useSidebarContext from "../contexts/SidebarContext";
import { NavbarFirstSection } from "../layouts/Navbar";
import { IoChevronDownSharp, IoChevronUpSharp } from "react-icons/io5";
import { useAppSelector } from "../redux/hooks";

type SidebarProps = {
  name: string;
  url: string;
  icon: IconType;
};
export default function SideBar() {
  const [selectedPageURL, setSelectedPageURL] = useState<string>("/");
  const { isSmallOpen, isLargeOpen, close, isWatchRoute } = useSidebarContext();
  const { currentUser } = useAppSelector((state) => state.user);
  return (
    <>
      {!isWatchRoute && (
        <aside
          className={`bg-primary-bg sticky top-0 overflow-auto pb-0 pr-2 flex-col ml-1 gap-3 h-[calc(100vh-64px)] hidden sm:flex ${
            isLargeOpen ? "lg:hidden" : "sm:flex"
          } `}
        >
          {sidebarSmall.map((item: SidebarProps) => (
            <SmallSidebarButton
              key={item.name}
              name={item.name}
              url={item.url}
              icon={item.icon}
              isActive={selectedPageURL === item.url}
              setSelectedPageURL={setSelectedPageURL}
            />
          ))}
        </aside>
      )}
      {isSmallOpen && (
        <div
          onClick={close}
          className={`${
            !isWatchRoute && "lg:hidden"
          } fixed inset-0 z-[999] bg-gray-500 opacity-50`}
        />
      )}
      <aside
        className={`bg-primary-bg w-60 scrollbar-hover ${
          !isWatchRoute && "lg:sticky"
        } absolute top-0 overflow-y-auto flex-col gap-2 px-2  ${
          !isWatchRoute && (isLargeOpen ? "lg:flex" : "lg:hidden")
        } ${isSmallOpen ? "flex z-[999] inset-0 bg-primary-bg" : "hidden"}`}
      >
        <div
          className={`${
            !isWatchRoute && "lg:hidden"
          } pt-2 pb-4 px-2 sticky top-0 bg-primary-bg`}
        >
          <NavbarFirstSection showSearchBar={false} />
        </div>
        <div className="space-y-2 divide-y divide-primary-border">
          <div>
            {mainMenuItem.map((item: SidebarProps) => (
              <LargeSidebarButton
                key={item.name}
                name={item.name}
                url={item.url}
                icon={item.icon}
                setSelectedPageURL={setSelectedPageURL}
                isActive={selectedPageURL === item.url}
              />
            ))}
          </div>
          <LargeSection>
            <div className="font-bold ml-4 my-3">Subscribed Channel</div>
            {currentUser && currentUser?.subscribedUsers.length > 0 ? (
              currentUser?.subscribedUsers.map((item) => (
                <ChannelSidebarButton
                  username={item.username}
                  key={item.id}
                  name={item.name}
                  icon={item.profileUrl}
                  setSelectedPageURL={setSelectedPageURL}
                  isActive={selectedPageURL === item.name}
                />
              ))
            ) : currentUser !== null ? (
              <p className="text-sm text-primary-text ml-4 my-3">
                No Subscribed Channel
              </p>
            ) : (
              <div className="m-4">
                <Link
                  to={"/login"}
                  className="border-2 border-primary-blue rounded-full px-2 py-1 text-primary-blue hover:bg-primary-hover"
                  type="button"
                >
                  Sign In
                </Link>
              </div>
            )}
          </LargeSection>
          <div>
            <div className="font-bold ml-4 my-3">Explore</div>
            {exploreItem.map((item: SidebarProps) => (
              <LargeSidebarButton
                key={item.name}
                name={item.name}
                url={item.url}
                icon={item.icon}
                setSelectedPageURL={setSelectedPageURL}
                isActive={selectedPageURL === item.url}
              />
            ))}
          </div>
          <div className="pt-4">
            {personalItem.map((item: SidebarProps) => (
              <LargeSidebarButton
                key={item.name}
                name={item.name}
                url={item.url}
                icon={item.icon}
                setSelectedPageURL={setSelectedPageURL}
                isActive={selectedPageURL === item.url}
              />
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
type ActiveSidebarProps = {
  username?: string;
  name: string;
  url: string;
  icon: IconType;
  isActive?: boolean;
  setSelectedPageURL: (url: string) => void;
};
function SmallSidebarButton({
  name,
  url,
  icon,
  isActive,
  setSelectedPageURL,
}: ActiveSidebarProps) {
  return (
    <Link
      to={url}
      onClick={() => setSelectedPageURL(url)}
      className={`hover:bg-primary-hover rounded-lg justify-center w-18 h-18 flex items-center text-sm py-2.5 ${
        isActive ? "bg-primary" : ""
      }`}
    >
      <div className="flex flex-col gap-2 items-center px-1">
        <div>{icon({ size: 25 })}</div>
        <div className="text-[11px]">{name}</div>
      </div>
    </Link>
  );
}

function LargeSidebarButton({
  name,
  url,
  icon,
  isActive,
  setSelectedPageURL,
}: ActiveSidebarProps) {
  return (
    <Link
      to={url}
      className={`hover:bg-primary-hover rounded-lg h-10 flex items-center text-sm px-4 ${
        isActive ? "bg-primary" : ""
      }`}
      onClick={() => setSelectedPageURL(url)}
    >
      <div className="flex flex-row gap-6 items-center">
        <div>{icon({ size: 25 })}</div>
        <div className="text-md flex-grow w-full">{name}</div>
      </div>
    </Link>
  );
}
type ActiveChannelProps = {
  username?: string;
  name: string;
  icon: string;
  isActive?: boolean;
  setSelectedPageURL: (url: string) => void;
};

function ChannelSidebarButton({
  username,
  name,
  icon,
  isActive,
  setSelectedPageURL,
}: ActiveChannelProps) {
  return (
    <Link
      to={`/channel/@${username}`}
      className={`hover:bg-primary-hover rounded-lg h-10 flex items-center text-sm px-4 ${
        isActive ? "bg-primary" : ""
      }`}
      onClick={() => setSelectedPageURL(`/@${name}`)}
    >
      <div className="flex flex-row gap-6 items-center flex-grow">
        <img src={icon} className=" w-6 rounded-full text-sm" />
        <div className="text-md w-full">{name}</div>
      </div>
    </Link>
  );
}
function LargeSection({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const VISIBLE_ITEMS = 4;
  const childrenArray = Children.toArray(children);
  const showVisibleButton = childrenArray.length > VISIBLE_ITEMS;
  const visibleItems = isExpanded
    ? childrenArray
    : childrenArray.slice(0, VISIBLE_ITEMS);
  const visibleButton = isExpanded ? IoChevronUpSharp : IoChevronDownSharp;
  const title = isExpanded ? "Show less" : "Show more";
  return (
    <div>
      {visibleItems}
      {showVisibleButton && (
        <button
          type="button"
          className="hover:bg-primary-hover rounded-lg h-10 flex items-center text-sm px-4 w-full"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <div className="flex flex-row gap-6 items-center flex-grow ">
            <div>{visibleButton({ size: 20 })}</div>
            <div className="text-md">{title}</div>
          </div>
        </button>
      )}
    </div>
  );
}
