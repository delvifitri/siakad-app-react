import { useState } from "react";
import MobileLayout from "../layouts/MobileLayout";

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
  const [attendance, setAttendance] = useState<Record<number, 'hadir' | 'izin' | 'sakit' | undefined>>({});
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const handleSelect = (id: number, status: 'hadir' | 'izin' | 'sakit') => {
    setAttendance((s) => ({ ...s, [id]: status }));
    setOpenMenuId(null);
  };

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
                {!attendance[c.id] ? (
                  <>
                    <button
                      onClick={() => setOpenMenuId(openMenuId === c.id ? null : c.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-orange-500 text-white`}
                    >
                      Presensi
                    </button>

                    {openMenuId === c.id && (
                      <div className="absolute right-4 top-12 w-36 bg-white  rounded-md shadow-lg z-20">
                        <button onClick={() => handleSelect(c.id, 'hadir')} className="w-full text-left px-4 py-2 hover:bg-gray-100 ">Hadir</button>
                        <button onClick={() => handleSelect(c.id, 'izin')} className="w-full text-left px-4 py-2 hover:bg-gray-100 ">Izin</button>
                        <button onClick={() => handleSelect(c.id, 'sakit')} className="w-full text-left px-4 py-2 hover:bg-gray-100 ">Sakit</button>
                      </div>
                    )}
                  </>
                ) : (
                  <span className="text-xs">
                    <span className={`px-2 py-0.5 rounded-full text-white text-xs ${attendance[c.id] === 'hadir' ? 'bg-green-500' : attendance[c.id] === 'izin' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                      {attendance[c.id] === 'hadir' ? 'Hadir' : attendance[c.id] === 'izin' ? 'Izin' : 'Sakit'}
                    </span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}
