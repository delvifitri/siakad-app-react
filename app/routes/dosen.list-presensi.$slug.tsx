import { useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import DosenLayout from "../layouts/DosenLayout";
import { PlusSmallIcon, ArrowLeftIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";

export function meta() {
  return [{ title: "Daftar Presensi - Siakad" }];
}

// dummy presensi sessions (in real app this should come from API)
const dummySessions = [
  { id: "2025-10-01", label: "Pertemuan 1", date: "2025-10-01", status: "Selesai" },
  { id: "2025-10-08", label: "Pertemuan 2", date: "2025-10-08", status: "Selesai" },
  { id: "2025-10-15", label: "Pertemuan 3", date: "2025-10-15", status: "Terjadwal" },
];

export default function DosenListPresensi() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const course = useMemo(() => (location.state as any)?.course || slug || "Mata Kuliah", [location.state, slug]);
  const cls = useMemo(() => (location.state as any)?.cls || "", [location.state]);
  const code = useMemo(() => (location.state as any)?.code || "", [location.state]);

  useEffect(() => {
    try {
      const role = localStorage.getItem("userRole");
      if (role !== "dosen") navigate("/", { replace: true });
    } catch {}
  }, [navigate]);

  const goToAdd = () => {
    // navigate to existing input-presensi route to add a new session
    navigate(`/dosen/input-presensi/${slug}`, { state: { course, cls, code } });
  };

  return (
    <DosenLayout bgImage="/bg simple.png">
      <section className="px-4 pt-6 pb-10">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Daftar Presensi</h1>
            <p className="text-sm text-gray-600 mt-1">{course} {cls ? `• Kelas ${cls}` : ""}</p>
          </div>
          <div className="w-36">
            <button onClick={goToAdd} className="inline-flex items-center justify-center gap-2 px-3 h-10 rounded-full text-sm text-white bg-green-600 hover:bg-green-700 w-full">
              <PlusSmallIcon className="w-4 h-4" /> Tambah Presensi
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {dummySessions.map((s) => (
            <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-3 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="rounded-md bg-blue-50 text-blue-700 p-2 flex items-center">
                  <CalendarDaysIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">{s.label}</div>
                  <div className="text-xs text-gray-500">{s.date} • {s.status}</div>
                </div>
              </div>
              <div className="w-36 text-right">
                <button onClick={() => navigate(`/dosen/presensi/${slug}`, { state: { sessionId: s.id, course, cls, code } })} className="inline-flex items-center gap-2 px-4 h-10 rounded-full text-xs text-white bg-blue-600 hover:bg-blue-700">
                  Lihat
                </button>
              </div>
            </div>
          ))}

          {dummySessions.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center text-sm text-gray-600">Belum ada sesi presensi untuk mata kuliah ini.</div>
          )}
        </div>
      </section>
    </DosenLayout>
  );
}
