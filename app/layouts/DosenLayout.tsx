import React from "react";
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

  return (
    <div className="min-h-screen bg-gray-50" style={style}>
      <main className="pb-24">{/* leave space for bottom nav (24 = ~72px) */}
        {children}
      </main>
      {showNav && <BottomNavDosen />}
    </div>
  );
}
