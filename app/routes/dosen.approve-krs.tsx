import DosenLayout from "../layouts/DosenLayout";
import { useMemo } from "react";
import { useNavigate } from "react-router";

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

  const list = useMemo(() => dummySubmissions, []);

  return (
    <DosenLayout title="Approve KRS" bgImage="/bg white.png">
      <div className="p-4">
        <header className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Pengajuan KRS Mahasiswa</h1>
          <p className="text-sm text-gray-600">Daftar mahasiswa yang mengajukan KRS ke Dosen PA.</p>
        </header>

        <div className="space-y-3">
          {list.map((s) => (
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
        </div>

      </div>
    </DosenLayout>
  );
}
