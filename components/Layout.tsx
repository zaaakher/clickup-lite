import React from "react";
import { ThemeToggle } from "./ThemeToggle";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div suppressHydrationWarning>
      <div className="h-screen flex justify-center items-center relative flex-col gap-6">
        <div className="w-full flex flex-row justify-between absolute top-0 p-4 border-b">
          <h1 className="text-xl font-extrabold items-center flex">
            ClickUp Lite
          </h1>
          <ThemeToggle />
        </div>
        <div className="top-[72px] w-full h-[calc(100%-72px)] absolute">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
