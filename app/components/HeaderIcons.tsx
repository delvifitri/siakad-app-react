import {
  BellIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function HeaderIcons() {
  const [isDosen, setIsDosen] = useState(false);
  useEffect(() => {
    const path = window.location.pathname;
    setIsDosen(path.startsWith("/dosen"));
  }, []);
  return (
    <div className="flex items-center justify-between px-4 pt-4">
      <div className="flex items-center gap-3">
        {!isDosen && (
          <Link
            to="/notifications"
            aria-label="notifications"
            className="relative p-3 rounded-lg bg-white/12 backdrop-blur-md ring-1 ring-amber-300/30 shadow-sm inline-flex items-center"
          >
            <BellIcon className="w-6 h-6 text-amber-500" />
            <span className="absolute -top-2 -right-2 min-w-[18px] h-5 rounded-full bg-orange-500 text-white text-xs font-semibold flex items-center justify-center px-1.5">
              1
            </span>
          </Link>
        )}
        <Link
          to="/messages"
          aria-label="messages"
          className="relative p-3 rounded-lg bg-white/12 backdrop-blur-md ring-1 ring-blue-300/30 shadow-sm inline-flex items-center"
        >
          <ChatBubbleLeftEllipsisIcon className="w-6 h-6 text-blue-400" />
          <span className="absolute -top-2 -right-2 min-w-[18px] h-5 rounded-full bg-red-500 text-white text-xs font-semibold flex items-center justify-center px-1.5">
            1
          </span>
        </Link>
      </div>
      <Link
        to={isDosen ? "/dosen/edit-profile" : "/edit-profile"}
        aria-label="profile"
        className="p-1 rounded-full bg-white/20 backdrop-blur-md ring-2 ring-white/30 shadow-md overflow-hidden"
      >
        <img
          src="/profile.jpg"
          alt="profile"
          className="w-12 h-12 rounded-full object-cover"
        />
      </Link>
    </div>
  );
}
