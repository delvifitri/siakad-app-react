import React, { useEffect } from "react";
import BottomNavDosen from "../components/BottomNavDosen";

export default function DosenLayout({
  children,
  title,
  bgImage,
  showNav = true,
}: {
  children: React.ReactNode;
  title?: string;
  bgImage?: string;
  showNav?: boolean;
}) {
  const style = bgImage
    ? { backgroundImage: `url('${bgImage}')`, backgroundSize: "cover", backgroundPosition: "center" }
    : undefined;

  useEffect(() => {
    const setAppHeight = () => {
      try {
        document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
      } catch (e) {
        /* noop */
      }
    };

    setAppHeight();
    window.addEventListener("resize", setAppHeight);
    return () => window.removeEventListener("resize", setAppHeight);
  }, []);

  // ensure the dynamic var is used as a fallback for min-height
  const combinedStyle: React.CSSProperties = {
    ...(style as React.CSSProperties),
    minHeight: "var(--app-height, 100vh)",
  };

  return (
    <div className="min-h-app bg-gray-50" style={combinedStyle}>
      <main className="pb-24">{/* leave space for bottom nav (24 = ~72px) */}
        {children}
      </main>
      {showNav && <BottomNavDosen />}
    </div>
  );
}
