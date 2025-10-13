import { useEffect, useState } from "react";
import MobileLayout from "../layouts/MobileLayout";
import notifications from "../data/notificationData";

export function meta() {
  return [{ title: "Presensi - Siakad" }];
}

type Course = {
  id: number;
  code: string;
  name: string;
  time: string;
  room: string;
};

const initialCourses: Course[] = [
  { id: 1, code: "IF101", name: "Pemrograman Web", time: "08:00 - 10:00", room: "R101" },
  { id: 2, code: "IF203", name: "Sistem Operasi", time: "10:30 - 12:00", room: "R202" },
  { id: 3, code: "IF305", name: "Jaringan Komputer", time: "13:00 - 14:30", room: "R303" },
];

export default function Presensi() {
  const [courses] = useState<Course[]>(initialCourses);
  const [statusMap, setStatusMap] = useState<Record<string, 'hadir' | 'izin' | 'sakit' | 'belum'>>({});

  // Load saved presensi records and map them to course names using notifications data
  useEffect(() => {
    try {
      const raw = localStorage.getItem('presensiRecords');
      const records: Array<{ id: string; status: 'hadir'|'izin'|'sakit'; fileName?: string|null; timestamp?: string }> = raw ? JSON.parse(raw) : [];
      // map notification id -> course name
      const idToCourse: Record<string, string> = {};
      notifications.forEach((n) => {
        if (n.type === 'presensi' && n.course) idToCourse[n.id] = n.course;
      });

      // for each record, keep latest by timestamp per course
      const latestByCourse: Record<string, { status: string; ts: number }> = {};
      records.forEach((r) => {
        const course = idToCourse[r.id];
        if (!course) return;
        const ts = r.timestamp ? new Date(r.timestamp).getTime() : 0;
        if (!latestByCourse[course] || ts > latestByCourse[course].ts) {
          latestByCourse[course] = { status: r.status, ts };
        }
      });

      const map: Record<string, 'hadir'|'izin'|'sakit'|'belum'> = {};
      courses.forEach((c) => {
        const s = latestByCourse[c.name];
        map[c.name] = s ? (s.status as 'hadir'|'izin'|'sakit') : 'belum';
      });
      setStatusMap(map);
    } catch (e) {
      // ignore
    }
  }, [courses]);

  return (
    <MobileLayout title="Presensi" bgImage="/bg simple.png">
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900 ">Presensi</h1>
        <p className="text-gray-700 ">Daftar mata kuliah yang mengharuskan presensi hari ini.</p>

        <div className="space-y-3 mt-3">
          {courses.map((c) => (
            <div key={c.id} className="relative bg-white  rounded-xl p-4 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">{c.code} • {c.room}</div>
                <div className="font-medium text-gray-900 ">{c.name}</div>
                <div className="text-xs text-gray-500">{c.time}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs">
                  {(() => {
                    const s = statusMap[c.name] ?? 'belum';
                    if (s === 'hadir') return <span className="px-2 py-0.5 rounded-full text-white text-xs bg-green-500">Hadir</span>;
                    if (s === 'izin') return <span className="px-2 py-0.5 rounded-full text-white text-xs bg-yellow-500">Izin</span>;
                    if (s === 'sakit') return <span className="px-2 py-0.5 rounded-full text-white text-xs bg-red-500">Sakit</span>;
                    return <span className="px-2 py-0.5 rounded-full text-gray-700 text-xs bg-gray-100">Belum</span>;
                  })()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}
