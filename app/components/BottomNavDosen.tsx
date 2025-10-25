import { Link, useLocation } from "react-router";
import { HomeIcon, ClipboardDocumentListIcon, UserGroupIcon, ClipboardDocumentCheckIcon, UserIcon } from "@heroicons/react/24/outline";

export default function BottomNavDosen() {
  const { pathname } = useLocation();

  const items = [
    { to: "/dosen", label: "Dashboard", icon: <HomeIcon className="w-6 h-6" /> },
    { to: "/dosen/nilai-presensi", label: "Nilai & Presensi", icon: <ClipboardDocumentListIcon className="w-6 h-6" /> },
  { to: "/dosen/bimbingan", label: "Bimbingan TA", icon: <UserGroupIcon className="w-6 h-6" /> },
    { to: "/dosen/ujian", label: "Ujian", icon: <ClipboardDocumentCheckIcon className="w-6 h-6" /> },
    { to: "/dosen/profile", label: "Profil", icon: <UserIcon className="w-6 h-6" /> },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 w-full bg-white/40 backdrop-blur-md border-t border-white/10 shadow-lg rounded-t-4xl overflow-hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex items-center justify-around text-xs py-3 px-2">
        {items.map((it) => {
          const active = pathname === it.to || (it.to !== "/" && pathname.startsWith(it.to));
          return (
            <li key={it.to} className="flex-1">
              <Link to={it.to} aria-label={it.label} className={`flex flex-col items-center gap-1 py-2 ${active ? "text-blue-600" : "text-gray-700"}`}>
                <span className={`${active ? "bg-blue-100/70 text-blue-600" : "bg-white/0"} p-2 rounded-full`}>{it.icon}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
