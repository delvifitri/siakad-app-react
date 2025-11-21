import SimpleLayout from "../layouts/SimpleLayout";
import { useNavigate } from "react-router";

export function meta() {
  return [{ title: "Nilai & Presensi - Dosen" }];
}

export default function NilaiPresensi() {
  const navigate = useNavigate();
  const courses = [
    { code: "IF101", name: "Pemrograman Web" },
    { code: "IF202", name: "Basis Data" },
    { code: "IF305", name: "Jaringan Komputer" },
  ];
  return (
    <SimpleLayout title="Nilai & Presensi">
      <div className="p-4 space-y-3">
        <p className="text-gray-700">Pilih mata kuliah untuk melakukan aksi cepat.</p>
        <div className="space-y-2">
          {courses.map((c) => (
            <div key={c.code} className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-200">
              <div>
                <div className="text-sm text-gray-500">{c.code}</div>
                <div className="font-medium text-gray-900">{c.name}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigate(`/dosen/lihat-nilai/${c.code}`, { state: { course: c.name } })} className="px-3 py-1 rounded-full text-xs bg-blue-600 text-white">Input Nilai</button>
                <button onClick={() => navigate(`/dosen/input-presensi/${c.code}`, { state: { course: c.name } })} className="px-3 py-1 rounded-full text-xs bg-emerald-600 text-white">Input Presensi</button>
                <button className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">Download Form</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SimpleLayout>
  );
}
