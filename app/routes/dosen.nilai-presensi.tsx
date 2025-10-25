import { useEffect } from "react";
import { useNavigate } from "react-router";
import DosenLayout from "../layouts/DosenLayout";
import { AcademicCapIcon, ClipboardDocumentCheckIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

export function meta() {
  return [{ title: "Nilai & Presensi (Dosen) - Siakad" }];
}

const courses = [
  { code: "IF301", name: "Pemrograman Web", cls: "A", mahasiswa: 32 },
  { code: "IF205", name: "Basis Data", cls: "B", mahasiswa: 28 },
  { code: "IF210", name: "Jaringan Komputer", cls: "A", mahasiswa: 30 },
];

export default function DosenNilaiPresensi() {
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const role = localStorage.getItem("userRole");
      if (role !== "dosen") navigate("/", { replace: true });
    } catch {}
  }, [navigate]);

  return (
    <DosenLayout bgImage="/bg simple.png">
      <section className="px-4 pt-6">
        <h1 className="text-xl font-bold text-gray-900">Nilai & Presensi</h1>
        <p className="text-sm text-gray-600 mt-1">Kelola nilai dan presensi untuk mata kuliah yang Anda ampu.</p>

        <div className="mt-4 space-y-3">
          {courses.map((c) => (
            <div key={c.code+"-"+c.cls} className="bg-white/60 rounded-xl border border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{c.name} ({c.cls})</div>
                  <div className="text-xs text-gray-600">Kode: {c.code} • {c.mahasiswa} mhs</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-white text-xs bg-blue-600">
                    <AcademicCapIcon className="w-4 h-4"/> Input Nilai
                  </button>
                  <button className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-white text-xs bg-emerald-600">
                    <ClipboardDocumentCheckIcon className="w-4 h-4"/> Input Presensi
                  </button>
                  <button className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-gray-700 text-xs bg-gray-100">
                    <ArrowDownTrayIcon className="w-4 h-4"/> Form
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </DosenLayout>
  );
}
