import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import DosenLayout from "../layouts/DosenLayout";
import { PencilSquareIcon, ArrowRightOnRectangleIcon, UserIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export function meta() {
  return [{ title: "Profil Dosen - Siakad" }];
}

export default function DosenProfile() {
  const navigate = useNavigate();
  const displayName = useMemo(() => {
    try {
      const stored = localStorage.getItem('profileName');
      if (stored && stored.trim().length > 0) return stored;
      return 'Dr. Ahmad Fauzi';
    } catch {
      return 'Dr. Ahmad Fauzi';
    }
  }, []);
  const nidn = useMemo(() => {
    try {
      const v = localStorage.getItem('profileNidn');
      if (v && v.trim()) return v;
    } catch {}
    return '199001012020031234';
  }, []);

  const nuptk = useMemo(() => {
    try {
      const v = localStorage.getItem('profileNuptk');
      if (v && v.trim()) return v;
    } catch {}
    return '00987654321';
  }, []);

  const profileMajor = useMemo(() => {
    try {
      const v = localStorage.getItem('profileMajor');
      if (v && v.trim()) return v;
    } catch {}
    return 'Informatika';
  }, []);

  const signature = useMemo(() => {
    try {
      return localStorage.getItem('profileSignature');
    } catch {
      return null;
    }
  }, []);
  const email = useMemo(() => {
    try {
      const stored = localStorage.getItem('profileEmail');
      if (stored && stored.trim().length > 0) return stored;
    } catch {}
    // derive from displayName if not stored
    const toEmailFromName = (fullName: string, domain = "kampus.ac.id") => {
      try {
        const cleaned = fullName
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\./g, " ")
          .replace(/[^a-zA-Z\s'-]/g, "")
          .trim()
          .toLowerCase();
        const titles = new Set(["dr", "prof", "ir", "h", "hj"]);
        const parts = cleaned
          .split(/\s+/)
          .filter(Boolean)
          .filter((p) => !titles.has(p));
        if (parts.length === 0) return `dosen@${domain}`;
        const first = parts[0].replace(/[^a-z]/g, "");
        const last = (parts.length > 1 ? parts[parts.length - 1] : "").replace(/[^a-z]/g, "");
        const user = last ? `${first}.${last}` : first;
        return `${user}@${domain}`;
      } catch {
        return "dosen@kampus.ac.id";
      }
    };
    return toEmailFromName(displayName);
  }, [displayName]);
  useEffect(() => {
    try {
      const role = localStorage.getItem("userRole");
      if (role !== "dosen") navigate("/", { replace: true });
    } catch {}
  }, [navigate]);

  const logout = () => {
    try {
      localStorage.removeItem("userRole");
    } catch {}
    navigate("/login", { replace: true });
  };
  return (
    <DosenLayout bgImage="/bg simple.png">
      <section className="px-4 pt-6 pb-24">
        <h1 className="text-xl font-bold text-gray-900">Profil Dosen</h1>
        <p className="text-sm text-gray-600 mt-1">Kelola informasi akun dan preferensi Anda.</p>

        {/* Card utama dengan background simple */}
        <div className="mt-4 bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center"><UserIcon className="w-7 h-7"/></div>
            <div>
              <div className="text-base font-semibold text-gray-900">{displayName}</div>
              <div className="text-xs text-gray-600">Program Studi {profileMajor}</div>
              <div className="mt-2">
                <div className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 font-medium inline-flex items-center gap-2">
                  <ShieldCheckIcon className="w-4 h-4" /> Dosen
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-700">
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-xs text-gray-500">Email</div>
              <div className="font-medium">{email}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-xs text-gray-500">NIDN</div>
              <div className="font-medium">{nidn}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-xs text-gray-500">NUPTK</div>
              <div className="font-medium">{nuptk}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-xs text-gray-500">Keahlian</div>
              <div className="font-medium">Web, Basis Data, Jaringan</div>
            </div>
          </div>
          {signature && (
            <div className="mt-4">
              <div className="text-xs text-gray-500">Tanda Tangan</div>
              <div className="mt-2 bg-white p-3 rounded-xl border border-gray-200 inline-block">
                <img src={signature} alt="ttd" className="h-20 object-contain" />
              </div>
            </div>
          )}
          {/* Tombol aksi: Edit Profil & Logout */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate('/edit-profile')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white bg-orange-500 hover:bg-orange-600 text-sm"
            >
              <PencilSquareIcon className="w-5 h-5"/> Edit Profil
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white bg-red-600 hover:bg-red-700 text-sm"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5"/> Logout
            </button>
          </div>
        </div>

        {/* Bagian 'Tentang Aplikasi' dihapus sesuai permintaan */}
      </section>
    </DosenLayout>
  );
}
