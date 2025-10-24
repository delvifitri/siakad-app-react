import { useEffect } from "react";
import { useNavigate } from "react-router";
import DosenLayout from "../layouts/DosenLayout";
import { ClipboardDocumentCheckIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

export function meta() {
  return [{ title: "Ujian (Dosen) - Siakad" }];
}

const exams = [
  { course: "Basis Data", date: "Jum, 10:00", room: "Aula-1", role: "Pengawas" },
  { course: "Jaringan Komputer", date: "Sen, 13:00", room: "Lab-2", role: "Koordinator" },
];

export default function DosenUjian() {
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const role = localStorage.getItem("userRole");
      if (role !== "dosen") navigate("/", { replace: true });
    } catch {}
  }, [navigate]);

  return (
    <DosenLayout>
      <section className="px-4 pt-6">
        <h1 className="text-xl font-bold text-gray-900">Ujian</h1>
        <p className="text-sm text-gray-600 mt-1">Jadwal ujian yang melibatkan Anda.</p>

        <div className="mt-4 space-y-3">
          {exams.map((e, idx) => (
            <div key={idx} className="bg-white/60 rounded-xl border border-gray-200 p-3">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-semibold text-gray-900">{e.course}</div>
                  <div className="text-xs text-gray-600">{e.date} • {e.room} • {e.role}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-white text-xs bg-emerald-600">
                    <ClipboardDocumentCheckIcon className="w-4 h-4"/> Presensi Pengawas
                  </button>
                  <button className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-gray-700 text-xs bg-gray-100">
                    <InformationCircleIcon className="w-4 h-4"/> Detail
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
