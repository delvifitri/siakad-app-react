import { useEffect } from "react";
import { useNavigate } from "react-router";
import DosenLayout from "../layouts/DosenLayout";
import { UserIcon, CheckCircleIcon, ClockIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

export function meta() {
  return [{ title: "Bimbingan Akademik (Dosen) - Siakad" }];
}

const advisees = [
  { name: "Ani Lestari", nim: "202101234", semester: 3, status: "aktif", chatId: 9 },
  { name: "Budi Santoso", nim: "202101235", semester: 5, status: "butuh konsultasi", chatId: 10 },
  { name: "Citra Rahma", nim: "202101236", semester: 7, status: "aktif", chatId: 11 },
];

export default function DosenBimbinganAkademik() {
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const role = localStorage.getItem("userRole");
      if (role !== "dosen") navigate("/", { replace: true });
    } catch {}
  }, [navigate]);

  return (
    <DosenLayout bgImage="/bg simple.png">
      <section className="px-4 pt-6 pb-24">
        <h1 className="text-xl font-bold text-gray-900">Bimbingan Akademik</h1>
        <p className="text-sm text-gray-600 mt-1">Kelola pembimbingan akademik mahasiswa bimbingan Anda.</p>

        <div className="mt-4 space-y-3">
          {advisees.map((mhs, idx) => (
            <div key={idx} className="bg-white/60 rounded-xl border border-gray-200 p-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center"><UserIcon className="w-5 h-5"/></div>
                  <div>
                    <div className="font-semibold text-gray-900">{mhs.name} <span className="text-xs text-gray-500">({mhs.nim})</span></div>
                    <div className="text-xs text-gray-600">Semester {mhs.semester}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {mhs.status === "aktif" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-emerald-100 text-emerald-700"><CheckCircleIcon className="w-4 h-4"/> Aktif</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-amber-100 text-amber-700"><ClockIcon className="w-4 h-4"/> Butuh Konsultasi</span>
                  )}
                  <button
                    onClick={() => navigate(`/chat/${mhs.chatId}`)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-blue-600 text-white hover:bg-blue-700"
                    aria-label={`Chat dengan ${mhs.name}`}
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    Chat
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
