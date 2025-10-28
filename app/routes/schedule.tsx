import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import SimpleLayout from "../layouts/SimpleLayout";

interface ScheduleItem {
  course: string;
  lecturer: string;
  time: string;
  room: string;
  day: string;
}

export default function Schedule() {
  const [activeTab, setActiveTab] = useState<'today' | 'week'>('today');
  const navigate = useNavigate();

  const isDosen = useMemo(() => {
    try {
      return localStorage.getItem('userRole') === 'dosen';
    } catch {
      return false;
    }
  }, []);

  // Dosen-specific view (moved from Dosen dashboard quick preview)
  if (isDosen) {
    type DosenWeekItem = { day: 'Min' | 'Sen' | 'Sel' | 'Rab' | 'Kam' | 'Jum' | 'Sab'; time: string; course: string; cls?: string; room: string; type: 'kuliah'; code: string };
    // Semua: jadwal kuliah Senin s/d Jumat
    const scheduleWeek: DosenWeekItem[] = [
      { day: 'Sen', time: "08:00–09:40", course: "Pemrograman Web", cls: "A", room: "R-301", type: 'kuliah', code: "IF301" },
      { day: 'Sen', time: "10:00–11:40", course: "Basis Data", cls: "B", room: "R-205", type: 'kuliah', code: "IF205" },
      { day: 'Sel', time: "09:00–10:40", course: "Algoritma & Struktur Data", cls: "B", room: "R-204", type: 'kuliah', code: "IF102" },
      { day: 'Rab', time: "13:30–15:10", course: "Jaringan Komputer", cls: "A", room: "Lab-2", type: 'kuliah', code: "IF210" },
      { day: 'Kam', time: "08:00–09:40", course: "Sistem Operasi", cls: "A", room: "R-210", type: 'kuliah', code: "IF401" },
      { day: 'Jum', time: "10:00–11:40", course: "Rekayasa Perangkat Lunak", cls: "C", room: "R-110", type: 'kuliah', code: "IF501" },
    ];

    // Helpers: sort by day then start time, and by start time within a day
    const dayOrder = useMemo<Record<DosenWeekItem['day'], number>>(
      () => ({ Min: 0, Sen: 1, Sel: 2, Rab: 3, Kam: 4, Jum: 5, Sab: 6 }),
      []
    );
    const dayLabel = useMemo<Record<DosenWeekItem['day'], string>>(
      () => ({ Min: 'Minggu', Sen: 'Senin', Sel: 'Selasa', Rab: 'Rabu', Kam: 'Kamis', Jum: 'Jumat', Sab: 'Sabtu' }),
      []
    );
    const dayColor = useMemo<Record<DosenWeekItem['day'], string>>(
      () => ({
        Min: 'bg-pink-500 text-white',
        Sen: 'bg-blue-500 text-white',
        Sel: 'bg-green-500 text-white',
        Rab: 'bg-orange-500 text-white',
        Kam: 'bg-purple-500 text-white',
        Jum: 'bg-red-500 text-white',
        Sab: 'bg-indigo-500 text-white',
      }),
      []
    );
    const parseStartMinutes = (time: string) => {
      const start = time.split(/[–-]/)[0]?.trim() ?? '';
      const [hh, mm] = start.split(':').map((v) => parseInt(v, 10));
      if (Number.isNaN(hh) || Number.isNaN(mm)) return 0;
      return hh * 60 + mm;
    };
    const weekKuliahSorted = useMemo(
      () =>
        scheduleWeek
          .filter((it) => it.type === 'kuliah')
          .slice()
          .sort((a, b) => dayOrder[a.day] - dayOrder[b.day] || parseStartMinutes(a.time) - parseStartMinutes(b.time)),
      [scheduleWeek, dayOrder]
    );

    // (Reverted) No grouping headers; list items with aligned day and time

    // Hari Ini: hanya jadwal kuliah pada hari ini
    // Override: 'Hari Ini' menampilkan jadwal hari Senin sesuai permintaan
    const todayCode = useMemo<DosenWeekItem['day']>(() => 'Sen', []);
    const todayKuliah = useMemo(
      () =>
        scheduleWeek
          .filter((it) => it.day === todayCode)
          .slice()
          .sort((a, b) => parseStartMinutes(a.time) - parseStartMinutes(b.time)),
      [scheduleWeek, todayCode]
    );

    // Week view now always shows all kuliah this week (exclude ujian/agenda)

    return (
      <SimpleLayout title="Jadwal Dosen">
        {/* Tabs */}
        <div className="mb-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('today')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'today' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setActiveTab('week')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Semua
            </button>
          </div>
        </div>

        {activeTab === 'today' ? (
          <div className="space-y-3">
            {todayKuliah.length === 0 ? (
              <div className="p-4 rounded-xl border border-gray-200 bg-white/60 text-sm text-gray-600">Tidak ada jadwal kuliah hari ini.</div>
            ) : (
              todayKuliah.map((s, idx) => {
                const slug = `${s.code}-${s.cls}`.toLowerCase().replace(/\s+/g, '-');
                return (
                <button key={idx} onClick={() => navigate(`/dosen/input-presensi/${slug}`, { state: { course: s.course, cls: s.cls, code: s.code, time: s.time, room: s.room } })} className="w-full text-left p-4 rounded-xl border border-gray-200 bg-white/60 hover:bg-white/80 transition-colors">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-semibold text-gray-900">{s.course}{s.cls ? ` (${s.cls})` : ''}</div>
                    <div className="w-32 flex-shrink-0 text-right text-gray-600">{s.time}</div>
                  </div>
                  <div className="mt-1 text-[12px] text-gray-600">Ruangan: <span className="font-medium text-gray-900">{s.room}</span></div>
                </button>
                );
              })
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {weekKuliahSorted.map((s, idx) => {
              const slug = `${s.code}-${s.cls}`.toLowerCase().replace(/\s+/g, '-');
              return (
              <button key={idx} onClick={() => navigate(`/dosen/input-presensi/${slug}`, { state: { course: s.course, cls: s.cls, code: s.code, time: s.time, room: s.room } })} className="w-full text-left flex rounded-xl border border-gray-200 bg-white/60 hover:bg-white/80 transition-colors overflow-hidden">
                <div className={`w-24 flex-shrink-0 flex items-start pl-3 py-4 text-sm font-semibold ${dayColor[s.day]}`}>
                  {dayLabel[s.day]}
                </div>
                <div className="flex-1 p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-900">
                      {s.course}{s.cls ? ` (${s.cls})` : ''}
                    </div>
                    <div className="w-32 text-right text-gray-600">{s.time}</div>
                  </div>
                  <div className="mt-1 text-[12px] text-gray-600">Ruang: <span className="font-medium text-gray-900">{s.room}</span></div>
                </div>
              </button>
              );
            })}
          </div>
        )}
      </SimpleLayout>
    );
  }

  const todaySchedule: ScheduleItem[] = [
    {
      course: "Pemrograman Web",
      lecturer: "Dr. Ahmad Fauzi",
      time: "08:00 - 10:00",
      room: "Lab Komputer 1",
      day: "Senin",
    },
    {
      course: "Basis Data",
      lecturer: "Prof. Siti Nurhaliza",
      time: "10:30 - 12:30",
      room: "Ruang 201",
      day: "Senin",
    },
  ];

  const weekSchedule: ScheduleItem[] = [
    {
      course: "Pemrograman Web",
      lecturer: "Dr. Ahmad Fauzi",
      time: "08:00 - 10:00",
      room: "Lab Komputer 1",
      day: "Senin",
    },
    {
      course: "Basis Data",
      lecturer: "Prof. Siti Nurhaliza",
      time: "10:30 - 12:30",
      room: "Ruang 201",
      day: "Senin",
    },
    {
      course: "Algoritma dan Struktur Data",
      lecturer: "Dr. Budi Santoso",
      time: "13:00 - 15:00",
      room: "Ruang 202",
      day: "Selasa",
    },
    {
      course: "Sistem Operasi",
      lecturer: "Prof. Rina Sari",
      time: "08:00 - 10:00",
      room: "Lab Sistem 1",
      day: "Rabu",
    },
    {
      course: "Jaringan Komputer",
      lecturer: "Dr. Eko Prasetyo",
      time: "10:30 - 12:30",
      room: "Ruang 203",
      day: "Kamis",
    },
  ];

  const currentSchedule = activeTab === 'today' ? todaySchedule : weekSchedule;

  const getDayColor = (day: string) => {
    const colors: { [key: string]: string } = {
      'Senin': 'bg-blue-500',
      'Selasa': 'bg-green-500',
      'Rabu': 'bg-orange-500',
      'Kamis': 'bg-purple-500',
      'Jumat': 'bg-red-500',
      'Sabtu': 'bg-indigo-500',
      'Minggu': 'bg-pink-500',
    };
    return colors[day] || 'bg-gray-500';
  };

  return (
    <SimpleLayout title="Jadwal Kuliah">
      <div className="mb-4">
        <div className="flex bg-gray-100  rounded-lg p-1">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'today'
                ? 'bg-white  text-gray-900  shadow-sm'
                : 'text-gray-600 '
            }`}
          >
            Hari Ini
          </button>
          <button
            onClick={() => setActiveTab('week')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'week'
                ? 'bg-white  text-gray-900  shadow-sm'
                : 'text-gray-600 '
            }`}
          >
            Minggu Ini
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {currentSchedule.map((item, index) => (
          activeTab === 'today' ? (
            <div key={index} className="p-4 rounded-lg bg-white  shadow-sm">
              <h3 className="font-semibold text-lg mb-2">{item.course}</h3>
              <div className="space-y-1 text-sm text-gray-600 ">
                <div className="flex">
                  <span className="w-16 font-medium">Dosen</span>
                  <span>: {item.lecturer}</span>
                </div>
                <div className="flex">
                  <span className="w-16 font-medium">Jam</span>
                  <span className="flex-1 text-right">: {item.time}</span>
                </div>
                <div className="flex">
                  <span className="w-16 font-medium">Ruang</span>
                  <span>: {item.room}</span>
                </div>
              </div>
            </div>
          ) : (
            <div key={index} className="flex rounded-lg bg-white  shadow-sm overflow-hidden">
              <div className={`w-20 flex items-center justify-center text-white font-semibold text-sm ${getDayColor(item.day)}`}>
                {item.day}
              </div>
              <div className="flex-1 p-4">
                <h3 className="font-semibold text-lg mb-2">{item.course}</h3>
                <div className="space-y-1 text-sm text-gray-600 ">
                  <div className="flex">
                    <span className="w-16 font-medium">Dosen</span>
                    <span>: {item.lecturer}</span>
                  </div>
                  <div className="flex">
                    <span className="w-16 font-medium">Jam</span>
                    <span className="flex-1 text-right">: {item.time}</span>
                  </div>
                  <div className="flex">
                    <span className="w-16 font-medium">Ruang</span>
                    <span>: {item.room}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        ))}
      </div>
    </SimpleLayout>
  );
}