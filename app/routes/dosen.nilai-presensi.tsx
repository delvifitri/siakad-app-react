import { useEffect } from "react";
import { useNavigate } from "react-router";
import DosenLayout from "../layouts/DosenLayout";
import { AcademicCapIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

export function meta() {
  return [{ title: "Nilai & Presensi (Dosen) - Siakad" }];
}

const courses = [
  { code: "IF301", name: "Pemrograman Web", cls: "A", mahasiswa: 32, time: "08:00–09:40", room: "R-301" },
  { code: "IF205", name: "Basis Data", cls: "B", mahasiswa: 28, time: "10:00–11:40", room: "R-205" },
  { code: "IF210", name: "Jaringan Komputer", cls: "A", mahasiswa: 30, time: "13:30–15:10", room: "Lab-2" },
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
          {courses.map((c) => {
            const slug = `${c.code}-${c.cls}`.toLowerCase().replace(/\s+/g, '-');
            return (
            <div key={c.code+"-"+c.cls} className="bg-white/60 rounded-xl border border-gray-200 p-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">{c.name} ({c.cls})</div>
                  <div className="text-xs text-gray-600">Kode: {c.code} • {c.mahasiswa} mhs</div>
                </div>
                <div className="w-full sm:w-[20rem]">
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => navigate(`/dosen/input-nilai/${c.code}`, { state: { course: c.name, cls: c.cls, code: c.code, mahasiswa: c.mahasiswa, time: c.time, room: c.room } })} className="inline-flex items-center justify-center gap-1 px-3 h-10 rounded-full text-xs text-white bg-blue-600 hover:bg-blue-700 w-full">
                      <AcademicCapIcon className="w-4 h-4"/> Lihat Nilai
                    </button>
                    <button onClick={() => navigate(`/dosen/input-presensi/${slug}`, { state: { course: c.name, cls: c.cls, code: c.code, mahasiswa: c.mahasiswa, time: c.time, room: c.room } })} className="inline-flex items-center justify-center gap-1 px-3 h-10 rounded-full text-xs text-white bg-orange-500 hover:bg-orange-600 w-full">
                      <ClipboardDocumentCheckIcon className="w-4 h-4"/> Lihat Presensi
                    </button>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </section>
    </DosenLayout>
  );
}
