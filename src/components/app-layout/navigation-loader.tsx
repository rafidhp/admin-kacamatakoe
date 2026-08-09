"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { usePathname } from "next/navigation";
import Loader from "../loader";

interface NavigationLoaderContextType {
  startLoading: () => void;
}

const NavigationLoaderContext = createContext<NavigationLoaderContextType | null>(null);

export function NavigationLoaderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  const startLoading = () => {
    setLoading(true);
  };

  return (
    <NavigationLoaderContext.Provider value={{ startLoading }}>
      {children}

      {loading && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <Loader />
        </div>
      )}
    </NavigationLoaderContext.Provider>
  );
}

export function useNavigationLoader() {
  const context = useContext(NavigationLoaderContext);

  if (!context) {
    throw new Error(
      "useNavigationLoader must be used within NavigationLoaderProvider"
    );
  }

  return context;
}