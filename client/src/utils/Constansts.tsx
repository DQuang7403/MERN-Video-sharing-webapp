import { IconType } from "react-icons";
import { AiOutlineHome, AiOutlineLike } from "react-icons/ai";
import {
  MdOutlinedFlag,
  MdOutlineSmartDisplay,
  MdOutlineSubscriptions,
} from "react-icons/md";
import { IoNewspaperOutline } from "react-icons/io5";
import { PiMusicNoteLight } from "react-icons/pi";
import { IoGameControllerOutline } from "react-icons/io5";
import { RiFireLine } from "react-icons/ri";
import { GoGear } from "react-icons/go";
import { CiTrophy } from "react-icons/ci";
import { FaRegQuestionCircle } from "react-icons/fa";
import { BsExclamationSquare } from "react-icons/bs";

export const categories = [
  "All",
  "JavaScript",
  "TypeScript",
  "Programming",
  "Weight Lifting",
  "Bowling",
  "Hiking",
  "React",
  "Next.js",
  "Functional Programming",
  "Object Oriented Programming",
  "Frontend Web Development",
  "Backend Web Development",
  "Web Development",
  "Coding",
];
type SidebarProps = {
  name: string;
  url: string;
  icon: IconType;
};
type SidebarLargeProps = {
  name: string;
  url: string;
  icon: IconType;
};

export const sidebarSmall: SidebarProps[] = [
  { name: "Home", url: "/", icon: AiOutlineHome },
  {
    name: "Subscription",
    url: "/feed/subscription",
    icon: MdOutlineSubscriptions,
  },
  { name: "You", url: "/profile", icon: MdOutlineSmartDisplay },
  { name: "Trending", url: "/explore/trending", icon: RiFireLine },
];

export const mainMenuItem: SidebarLargeProps[] = [
  { name: "Home", url: "/", icon: AiOutlineHome },
  {
    name: "Subscription",
    url: "/feed/subscription",
    icon: MdOutlineSubscriptions,
  },
  { name: "You", url: "/profile", icon: MdOutlineSmartDisplay },
  { name: "Like", url: "/like", icon: AiOutlineLike },
];
export const exploreItem: SidebarLargeProps[] = [
  { name: "Trending", url: "/explore/trending", icon: RiFireLine },
  { name: "Music", url: "/explore/music", icon: PiMusicNoteLight },
  { name: "Gaming", url: "/explore/gaming", icon: IoGameControllerOutline },
  { name: "News", url: "/explore/news", icon: IoNewspaperOutline },
  { name: "Sports", url: "/explore/sports", icon: CiTrophy },
];
export const personalItem: SidebarLargeProps[] = [
  { name: "Settings", url: "/setting", icon: GoGear },
  { name: "Help", url: "/help", icon: FaRegQuestionCircle },
  { name: "Report", url: "/report", icon: MdOutlinedFlag },
  { name: "Send Feedback", url: "/feedback", icon: BsExclamationSquare },
];

export const videos = [
  {
    id: "1",
    title: "CSS Anchor Is The Best New CSS Feature Since Flexbox",
    channel: {
      name: "Web Dev Simplified",
      id: "WebDevSimplified",
      profileUrl:
        "https://yt3.ggpht.com/ytc/APkrFKZWeMCsx4Q9e_Hm6nhOOUQ3fv96QGUXiMr1-pPP=s48-c-k-c0x00ffffff-no-rj",
    },
    views: 222536,
    postedAt: new Date("2023-08-29"),
    duration: 938,
    thumbnailUrl: "https://i.ytimg.com/vi/B4Y9Ed4lLAI/maxresdefault.jpg",
    videoUrl:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  },
];
export type VideoCardProps = {
  _id: string;
  title: string;
  description: string;
  views: number;
  createdAt: string;
  thumbnailUrl: string;
  videoUrl: string;
  dislikes: string[];
  likes: string[];
  tags: string[];
  userId: string;
};
export type ChannelType = {
  createdAt: string;
  _id: string;
  updatedAt: string;
  subscribers: number;
  subscribedUsers: string[];
  profileUrl: string;
  name: string;
  email: string;
  username: string;
};
