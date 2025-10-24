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
  // extra dummy for 'belum' presensi
  { id: 4, code: "IF410", name: "Analisis Algoritma", time: "10:45 - 12:15", room: "R404" },
];

export default function Presensi() {
  const [courses] = useState<Course[]>(initialCourses);
  const [statusMap, setStatusMap] = useState<Record<string, 'hadir' | 'izin' | 'sakit' | 'belum' | 'ditutup'>>(() => {
    // Build default map synchronously so SSR/first paint already shows correct badges
    const map: Record<string, 'hadir'|'izin'|'sakit'|'belum'|'ditutup'> = {};
    initialCourses.forEach((c) => {
      map[c.name] = 'belum';
    });
    map['Sistem Operasi'] = 'hadir';
    map['Jaringan Komputer'] = 'izin';
    // Apply demo closed presensi from notifications data (only one example)
    notifications.forEach((n) => {
      if (n.type === 'presensi' && n.closed && n.course) {
        map[n.course] = 'ditutup';
      }
    });
    return map;
  });
  const navigate = useNavigate();

  // Load saved presensi records and map them to course names using notifications data
  useEffect(() => {
    // Merge with local presensiRecords for 'ditutup' only on client
    try {
      const raw = localStorage.getItem('presensiRecords');
      const records: Array<{ id: string; status: string; fileName?: string | null; timestamp: string }>
        = raw ? JSON.parse(raw) : [];
      if (records.length) {
        setStatusMap((prev) => {
          const next = { ...prev } as typeof prev;
          records.forEach((r) => {
            if (r.status === 'ditutup') {
              const notif = notifications.find(n => n.id === r.id);
              // Only mark as ditutup if the notification is flagged closed in data (avoid overriding others)
              if (notif?.course && notif.closed) {
                next[notif.course] = 'ditutup';
              }
            }
          });
          return next;
        });
      }
    } catch (_) {}
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
                        <button onClick={go} className="px-2 py-0.5 rounded-full text-white text-xs bg-green-500">
                          Hadir
                        </button>
                      );
                    }
                    if (s === 'izin') {
                      const notif = notifications.find(n => n.type === 'presensi' && n.course === c.name);
                      const go = () => {
                        if (notif) {
                          const ts = new Date().toISOString();
                          navigate(`/presensi/${notif.id}?status=izin&fileName=${encodeURIComponent('surat_izin.pdf')}&ts=${encodeURIComponent(ts)}`);
                        } else {
                          navigate('/presensi');
                        }
                      };
                      return (
                        <button onClick={go} className="px-2 py-0.5 rounded-full text-white text-xs bg-yellow-500">
                          Izin
                        </button>
                      );
                    }
                    if (s === 'sakit') return <span className="px-2 py-0.5 rounded-full text-white text-xs bg-red-500">Sakit</span>;
                    if (s === 'ditutup') {
                      return (
                        <div className="flex flex-col items-end gap-1">
                          <button disabled className="px-2 py-0.5 rounded-full text-gray-400 text-xs bg-gray-100 cursor-not-allowed">
                            Presensi Ditutup
                          </button>
                          <div className="text-[11px] text-red-600">Maaf Anda terlambat presensi</div>
                        </div>
                      );
                    }
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
