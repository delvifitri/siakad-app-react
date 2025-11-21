import SimpleLayout from "../layouts/SimpleLayout";

export function meta() {
  return [{ title: "Ujian - Dosen" }];
}

export default function Ujian() {
  const schedules = [
    { name: "Ujian Basis Data", time: "Jum 10:00", room: "Aula-1" },
    { name: "Ujian Pemrograman Web", time: "Sen 09:00", room: "R-301" },
  ];
  return (
    <SimpleLayout title="Ujian">
      <div className="p-4 space-y-3">
        <p className="text-gray-700">Jadwal UTS/UAS dan presensi pengawas.</p>
        <div className="space-y-2">
          {schedules.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-200">
              <div>
                <div className="font-medium text-gray-900">{s.name}</div>
                <div className="text-xs text-gray-500">{s.time} • {s.room}</div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-full text-xs bg-emerald-600 text-white">Presensi Pengawas</button>
                <button className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">Detail</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SimpleLayout>
  );
}
