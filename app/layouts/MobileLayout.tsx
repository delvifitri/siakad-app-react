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

    // Use 100vh on server to match, then let AppHeightSetter update it on client
    const combinedStyle: React.CSSProperties = {
        ...(style as React.CSSProperties),
        minHeight: '100vh'
    };

    return (
        <div className="bg-gray-50" style={combinedStyle}>
            <main className="pb-24">{/* leave space for bottom nav (24 = ~72px) */}
                {children}
            </main>
            {showNav && <BottomNav />}
        </div>
    );
}
