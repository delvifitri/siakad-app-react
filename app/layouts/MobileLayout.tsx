import React from "react";
import BottomNav from "../components/BottomNav";

export default function MobileLayout({
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
        <div className="min-h-screen bg-gray-50 " style={style}>
            <main className="pb-24">{/* leave space for bottom nav (24 = ~72px) */}
                {children}
            </main>
            {showNav && <BottomNav />}
        </div>
    );
}
