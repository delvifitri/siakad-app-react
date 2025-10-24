import { useMemo, useState } from "react";
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

  const isDosen = useMemo(() => {
    try {
      return localStorage.getItem('userRole') === 'dosen';
    } catch {
      return false;
    }
  }, []);

  // Dosen-specific view (moved from Dosen dashboard quick preview)
  if (isDosen) {
    type DosenWeekItem = { time: string; course: string; cls?: string; room: string; type: 'kuliah' | 'ujian' | 'bimbingan'; day?: string };
    const scheduleToday: Array<{ time: string; course: string; cls: string; room: string }> = [
      { time: "08:00–09:40", course: "Pemrograman Web", cls: "A", room: "R-301" },
      { time: "10:00–11:40", course: "Basis Data", cls: "B", room: "R-205" },
      { time: "13:30–15:10", course: "Jaringan Komputer", cls: "A", room: "Lab-2" },
    ];
    const scheduleWeek: DosenWeekItem[] = [
      { day: 'Sen', time: "08:00–09:40", course: "Pemrograman Web", cls: "A", room: "R-301", type: 'kuliah' },
      { day: 'Sen', time: "10:00–11:40", course: "Basis Data", cls: "B", room: "R-205", type: 'kuliah' },
      { day: 'Rab', time: "13:30–15:10", course: "Jaringan Komputer", cls: "A", room: "Lab-2", type: 'kuliah' },
      { day: 'Jum', time: "10:00", course: "Ujian Basis Data", room: "Aula-1", type: 'ujian' },
      { day: 'Sab', time: "13:00", course: "Bimbingan TA", room: "R-207", type: 'bimbingan' },
    ];

    const [filter, setFilter] = useState<'all' | 'kuliah' | 'agenda'>('all');
    const weekFiltered = scheduleWeek.filter((it) =>
      filter === 'all' ? true : filter === 'kuliah' ? it.type === 'kuliah' : it.type !== 'kuliah'
    );

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
              Minggu Ini
            </button>
          </div>
        </div>

        {activeTab === 'today' ? (
          <div className="space-y-3">
            {scheduleToday.map((s, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-gray-200 bg-white/60">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-semibold text-gray-900">{s.course} ({s.cls})</div>
                  <div className="text-gray-600">{s.time}</div>
                </div>
                <div className="mt-1 text-[12px] text-gray-600">Ruangan: <span className="font-medium text-gray-900">{s.room}</span></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Filter chips */}
            <div className="mb-3 flex items-center gap-2">
              <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-full text-xs border ${filter==='all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'}`}>Semua</button>
              <button onClick={() => setFilter('kuliah')} className={`px-3 py-1.5 rounded-full text-xs border ${filter==='kuliah' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'}`}>Kuliah</button>
              <button onClick={() => setFilter('agenda')} className={`px-3 py-1.5 rounded-full text-xs border ${filter==='agenda' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'}`}>Agenda</button>
            </div>
            <div className="space-y-3">
              {weekFiltered.map((s, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-gray-200 bg-white/60 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-900">
                      {s.course}{s.cls ? ` (${s.cls})` : ''}
                    </div>
                    <div className="text-gray-600">{s.day} {s.time}</div>
                  </div>
                  <div className="mt-1 text-[12px] text-gray-600">Ruang: <span className="font-medium text-gray-900">{s.room}</span></div>
                </div>
              ))}
            </div>
          </>
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
                  <span>: {item.time}</span>
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
                    <span>: {item.time}</span>
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