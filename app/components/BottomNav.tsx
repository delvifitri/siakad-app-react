import { Link, useLocation } from "react-router";
import { HomeIcon, ClipboardDocumentCheckIcon, CreditCardIcon, DocumentTextIcon, UserIcon } from "@heroicons/react/24/outline";

export default function BottomNav() {
  const { pathname } = useLocation();
  // Paths where we should NOT apply the backdrop blur (so content underneath remains readable)

  const items = [
    { to: "/", label: "Beranda", icon: <HomeIcon className="w-6 h-6" /> },
    { to: "/presensi", label: "Presensi", icon: <ClipboardDocumentCheckIcon className="w-6 h-6" /> },
    { to: "/pembayaran", label: "Pembayaran", icon: <CreditCardIcon className="w-6 h-6" /> },
    { to: "/krs-khs", label: "KRS/KHS", icon: <DocumentTextIcon className="w-6 h-6" /> },
    { to: "/profile", label: "Akun", icon: <UserIcon className="w-6 h-6" /> },
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-lg rounded-t-4xl overflow-hidden`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex items-center justify-around text-xs py-3 px-2">
        {items.map((it) => {
          const active = pathname === it.to || (it.to !== "/" && pathname.startsWith(it.to));
          return (
            <li key={it.to} className="flex-1">
              <Link to={it.to} aria-label={it.label} className={`flex flex-col items-center gap-1 py-2 ${active ? "text-blue-600" : "text-gray-700"}`}>
                <span className={`${active ? "bg-blue-100/90 text-blue-600" : "bg-transparent text-gray-700" } p-2 rounded-full`}>{it.icon}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
