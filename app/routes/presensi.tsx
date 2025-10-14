import { useEffect, useState } from "react";
import MobileLayout from "../layouts/MobileLayout";
import { useNavigate } from "react-router-dom";
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
  // pemrograman web should match detail presensi time
  { id: 1, code: "IF101", name: "Pemrograman Web", time: "09:00 - 10:30", room: "R101" },
  // schedule the other two before Pemrograman Web
  { id: 2, code: "IF203", name: "Sistem Operasi", time: "07:30 - 08:45", room: "R202" },
  { id: 3, code: "IF305", name: "Jaringan Komputer", time: "08:45 - 09:00", room: "R303" },
];

export default function Presensi() {
  const [courses] = useState<Course[]>(initialCourses);
  const [statusMap, setStatusMap] = useState<Record<string, 'hadir' | 'izin' | 'sakit' | 'belum'>>({});
  const navigate = useNavigate();

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

      // Apply requested defaults when no saved presensi exists
      if (map['Sistem Operasi'] === 'belum') map['Sistem Operasi'] = 'hadir';
      if (map['Jaringan Komputer'] === 'belum') map['Jaringan Komputer'] = 'izin';

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
                    if (s === 'hadir') {
                      const notif = notifications.find(n => n.type === 'presensi' && n.course === c.name);
                      const go = () => {
                        if (notif) navigate(`/presensi/${notif.id}?status=hadir`);
                        else navigate('/presensi');
                      };
                      return (
                        <button onClick={go} className="px-2 py-0.5 rounded-full text-white text-xs bg-green-500 hover:opacity-90">
                          Hadir
                        </button>
                      );
                    }
                    if (s === 'izin') {
                      const notif = notifications.find(n => n.type === 'presensi' && n.course === c.name);
                      const go = () => {
                        if (notif) {
                          // ensure a demo record exists so detail page shows attachment
                          try {
                            const raw = localStorage.getItem('presensiRecords');
                            const records = raw ? JSON.parse(raw) : [];
                            const hasRecord = records.some((r: any) => r.id === notif.id && r.status === 'izin');
                            if (!hasRecord) {
                              records.push({ id: notif.id, status: 'izin', fileName: 'surat_izin.pdf', timestamp: new Date().toISOString() });
                              localStorage.setItem('presensiRecords', JSON.stringify(records));
                            }
                          } catch {}
                          navigate(`/presensi/${notif.id}?status=izin`);
                        } else {
                          navigate('/presensi');
                        }
                      };
                      return (
                        <button onClick={go} className="px-2 py-0.5 rounded-full text-white text-xs bg-yellow-500 hover:opacity-90">Izin</button>
                      );
                    }
                    if (s === 'sakit') return <span className="px-2 py-0.5 rounded-full text-white text-xs bg-red-500">Sakit</span>;
                    // Belum: find matching notification id for this course
                    const notif = notifications.find(n => n.type === 'presensi' && n.course === c.name);
                    const onClick = () => {
                      if (notif) navigate(`/notification/${notif.id}`);
                      else navigate('/notifications');
                    };
                    return (
                      <button onClick={onClick} className="px-2 py-0.5 rounded-full text-gray-700 text-xs bg-gray-100 hover:bg-gray-200">
                        Belum
                      </button>
                    );
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
