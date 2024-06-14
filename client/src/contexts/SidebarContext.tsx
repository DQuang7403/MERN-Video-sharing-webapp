import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
type SidebarContextProps = {
  close: () => void;
  toggle: () => void;
  isSmallOpen: boolean;
  isLargeOpen: boolean;
  isWatchRoute: boolean;
};
type ContextProviderProps = {
  children: React.ReactNode;
};
const SidebarContext = createContext<SidebarContextProps | null>(null);
export function SidebarProvider({ children }: ContextProviderProps) {
  const { pathname } = useLocation();
  const [isSmallOpen, setIsSmallOpen] = useState(false);
  const [isWatchRoute, setIsWatchRoute] = useState(
    pathname === "/watch",
  );
  const [isLargeOpen, setIsLargeOpen] = useState(isWatchRoute ? false : true);

  const isSmallScreen = () => {
    return window.innerWidth < 1024;
  };
  const close = () => {
    if (isSmallScreen() || isWatchRoute) {
      setIsSmallOpen(false);
    }
  };
  const toggle = () => {
    if (isSmallScreen()) {
      setIsSmallOpen((s) => !s);
    } else {
      if (isWatchRoute) setIsSmallOpen((s) => !s);
      setIsLargeOpen((l) => !l);
    }
  };
  useEffect(() => {
    setIsWatchRoute(pathname === "/watch");
    if(pathname === "/watch") {
      setIsLargeOpen(false);
    }
  }, [pathname]);
  useEffect(() => {
    const handle = () => {
      if (!isSmallScreen()) {
        setIsSmallOpen(false);
      }
    };
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return (
    <SidebarContext.Provider
      value={{ close, toggle, isSmallOpen, isLargeOpen, isWatchRoute }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
export default function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (context === null) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return context;
}
