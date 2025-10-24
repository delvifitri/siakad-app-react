import { useEffect } from "react";
import { useNavigate } from "react-router";
import DosenLayout from "../layouts/DosenLayout";
import { PencilSquareIcon, ArrowRightOnRectangleIcon, UserIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export function meta() {
  return [{ title: "Profil Dosen - Siakad" }];
}

export default function DosenProfile() {
  const navigate = useNavigate();
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
    <DosenLayout>
      <section className="px-4 pt-6 pb-24">
        <h1 className="text-xl font-bold text-gray-900">Profil Dosen</h1>
        <p className="text-sm text-gray-600 mt-1">Kelola informasi akun dan preferensi Anda.</p>

        <div className="mt-4 bg-white/60 rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center"><UserIcon className="w-7 h-7"/></div>
            <div>
              <div className="text-base font-semibold text-gray-900">Budi Santoso, M.Kom</div>
              <div className="text-xs text-gray-600">NIDN 012345678 • Program Studi Informatika</div>
              <div className="text-xs text-emerald-700 mt-1 inline-flex items-center gap-1"><ShieldCheckIcon className="w-4 h-4"/> Dosen</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-700">
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-xs text-gray-500">Email</div>
              <div className="font-medium">budi@kampus.ac.id</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-xs text-gray-500">No. HP</div>
              <div className="font-medium">0812-3456-7890</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-xs text-gray-500">Alamat</div>
              <div className="font-medium">Jl. Pendidikan No. 123, Kota</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-xs text-gray-500">Keahlian</div>
              <div className="font-medium">Web, Basis Data, Jaringan</div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-white bg-blue-600 text-sm">
              <PencilSquareIcon className="w-5 h-5"/> Edit Profil
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-blue-700 bg-blue-50 text-sm">
              Ubah Password
            </button>
          </div>
        </div>

        <div className="mt-4 bg-white/60 rounded-2xl border border-gray-200 p-4">
          <div className="text-sm font-semibold text-gray-900">Tentang Aplikasi</div>
          <div className="text-xs text-gray-600 mt-1">Versi 1.0.0 • Build demo</div>
        </div>

        <div className="mt-6">
          <button onClick={logout} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white bg-red-600 text-sm">
            <ArrowRightOnRectangleIcon className="w-5 h-5"/> Keluar
          </button>
        </div>
      </section>
    </DosenLayout>
  );
}
