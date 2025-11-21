import DosenLayout from "../layouts/DosenLayout";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export function meta() {
  return [{ title: "Approve KRS - Dosen" }];
}

const dummySubmissions = [
  { name: "Ani Lestari", nim: "202101234", program: "Informatika S1", semester: "6", approved: 12, total: 20 },
  { name: "Budi Santoso", nim: "202101235", program: "Informatika S1", semester: "6", approved: 7, total: 10 },
  { name: "Citra Rahma", nim: "202101236", program: "Sistem Informasi S1", semester: "5", approved: 3, total: 8 },
];

export default function DosenApproveKrs() {
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>("");
  // for now KRS is open; change logic later to read real status
  const krsOpen = true;

  const list = useMemo(() => dummySubmissions, []);

  return (
    <DosenLayout title="Approve KRS" bgImage="/bg white.png">
      <div className="p-4">
        <header className="mb-4 flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Pengajuan KRS Mahasiswa</h1>
            <p className="text-sm text-gray-600">Daftar mahasiswa yang mengajukan KRS ke Dosen PA.</p>
          </div>

          {/* KRS status badge (top-right) */}
          <div>
            {krsOpen ? (
              <div className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold">KRS Dibuka</div>
            ) : (
              <div className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-800 font-semibold">KRS Ditutup</div>
            )}
          </div>
        </header>

        {/* search input */}
        <div className="mb-4 max-w-md">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau NIM"
              className="pl-12 pr-3 py-2 border rounded-full w-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="space-y-3">
          {list.filter((s) => {
            const q = search.trim().toLowerCase();
            if (!q) return true;
            return s.name.toLowerCase().includes(q) || s.nim.toLowerCase().includes(q);
          }).map((s) => (
            <div key={s.nim} className="flex items-center justify-between bg-white/70 backdrop-blur-md rounded-xl px-3 py-3 ring-1 ring-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">{s.name}</p>
                <p className="text-xs text-gray-600">{s.nim} • {s.program} • Semester {s.semester}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold">{`${s.approved}/${s.total}`}</div>
                <button
                  onClick={() => navigate(`/dosen/approve-krs/${s.nim}`)}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700"
                >
                  Detail
                </button>
              </div>
            </div>
          ))}

          {/* no results */}
          {list.filter((s) => {
            const q = search.trim().toLowerCase();
            if (!q) return true;
            return s.name.toLowerCase().includes(q) || s.nim.toLowerCase().includes(q);
          }).length === 0 && (
            <div className="text-center text-sm text-gray-500 py-6">Tidak ada hasil untuk "{search}"</div>
          )}
        </div>

      </div>
    </DosenLayout>
  );
}
