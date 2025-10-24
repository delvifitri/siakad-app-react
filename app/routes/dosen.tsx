import DosenLayout from "../layouts/DosenLayout";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import HeaderIcons from "../components/HeaderIcons";
import QuickAction from "../components/QuickAction";
import StatCard from "../components/StatCard";
import NewsItem from "../components/NewsItem";
import {
  CalendarDaysIcon,
  UserGroupIcon,
  DocumentTextIcon,
  DocumentCheckIcon,
  ChatBubbleLeftEllipsisIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

export function meta() {
  return [{ title: "Dashboard Dosen - Siakad" }];
}

const scheduleToday = [
  { time: "08:00–09:40", course: "Pemrograman Web", cls: "A", room: "R-301" },
  { time: "10:00–11:40", course: "Basis Data", cls: "B", room: "R-205" },
  { time: "13:30–15:10", course: "Jaringan Komputer", cls: "A", room: "Lab-2" },
];

const krsWaiting = [
  { name: "Ani Lestari", nim: "202101234", count: 8 },
  { name: "Budi Santoso", nim: "202101235", count: 7 },
  { name: "Citra Rahma", nim: "202101236", count: 6 },
];

export default function DosenDashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    // Simple role guard: if not dosen, redirect to home
    try {
      const role = localStorage.getItem("userRole");
      if (role !== "dosen") {
        navigate("/", { replace: true });
      }
    } catch {}
  }, [navigate]);
  const classesToday = scheduleToday.length;
  const krsPending = 3; // ringkas sesuai kartu
  const bimbinganCount = 12; // dummy
  const activeCourses = 5; // dummy mata kuliah aktif semester ini
  const examsThisWeek = 2; // dummy ujian minggu ini

  return (
    <DosenLayout title="Siakad" bgImage="/bg white.png">
      <HeaderIcons />

      <section className="px-4 mt-6">
        <div className="text-black">
          <p className="text-2xl font-bold">Selamat datang, Pak/Bu Budi 👋</p>
        </div>

        {/* Kartu Ringkasan Cepat */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="block">
            <StatCard icon={<DocumentTextIcon className="w-6 h-6 text-blue-600" />} title="Mata Kuliah Aktif" value={activeCourses} />
          </div>
          <div className="block">
            <StatCard icon={<UserGroupIcon className="w-6 h-6 text-green-600" />} title="Mahasiswa Bimbingan" value={bimbinganCount} />
          </div>
          <a href="/status-krs" className="block" aria-label="KRS Menunggu Approve">
            <StatCard icon={<DocumentCheckIcon className="w-6 h-6 text-purple-600" />} title="KRS Menunggu Approve" value={krsPending} />
          </a>
          <div className="block">
            <StatCard icon={<AcademicCapIcon className="w-6 h-6 text-orange-500" />} title="Ujian Minggu Ini" value={examsThisWeek} />
          </div>
        </div>

        {/* Shortcut Aksi Cepat */}
        <div className="grid grid-cols-4 gap-3 mt-6">
          <QuickAction icon={<AcademicCapIcon className="w-7 h-7 mb-2 text-white" />} label="Input Nilai" className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white" to="/dosen/nilai-presensi" />
          <QuickAction icon={<CalendarDaysIcon className="w-7 h-7 mb-2 text-white" />} label="Tambah Presensi" className="bg-gradient-to-br from-emerald-500 to-green-600 text-white" to="/dosen/nilai-presensi" />
          <QuickAction icon={<DocumentCheckIcon className="w-7 h-7 mb-2 text-white" />} label="Approve KRS" className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white" to="/status-krs" />
          <QuickAction icon={<UserGroupIcon className="w-7 h-7 mb-2 text-blue-600" />} label="Lihat Bimbingan" className="bg-white text-blue-600 border border-gray-200" to="/dosen/bimbingan" />
        </div>

        {/* Feed / Pengumuman */}
        <div className="mt-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Feed & Pengumuman</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            <NewsItem title="Pengumuman Akademik: Input Nilai UTS Dibuka" to="/news/1" day="07" month="Sep" />
            <article className="flex items-center gap-3 bg-white/50 backdrop-blur-md rounded-xl p-3 ring-1 ring-white/30">
              <div className="w-24 h-20 rounded-lg bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center flex-shrink-0 flex-col shadow-lg">
                <span className="text-2xl font-bold text-white tracking-tight">KRS</span>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900 leading-tight">3 KRS baru menunggu persetujuan</h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">Tinjau dan setujui pengajuan KRS mahasiswa.</p>
              </div>
            </article>
            <article className="flex items-center gap-3 bg-white/50 backdrop-blur-md rounded-xl p-3 ring-1 ring-white/30">
              <div className="w-24 h-20 rounded-lg bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center flex-shrink-0 flex-col shadow-lg">
                <span className="text-2xl font-bold text-white tracking-tight">TA</span>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900 leading-tight">Mahasiswa mengajukan bimbingan</h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">2 permintaan bimbingan baru menunggu tindak lanjut.</p>
              </div>
            </article>
            <NewsItem title="Rapat Dosen Minggu Ini" to="/news/2" day="17" month="Des" />
          </div>
        </div>

        {/* Upcoming Events / Jadwal */}
        <div className="mt-6 bg-white/60 rounded-2xl ring-1 ring-white/30 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Jadwal & Agenda Terdekat</h2>
            <a href="/schedule" className="text-xs text-blue-600 hover:underline">Lihat Jadwal</a>
          </div>
          <div className="mt-3 space-y-2">
            {scheduleToday.slice(0, 2).map((s, idx) => (
              <div key={idx} className="p-2 rounded-xl border border-gray-200 bg-white/60">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-semibold text-gray-900">{s.course} ({s.cls})</div>
                  <div className="text-gray-600">{s.time}</div>
                </div>
                <div className="mt-1 text-[11px] text-gray-600">Ruangan: <span className="font-medium text-gray-900">{s.room}</span></div>
              </div>
            ))}
            <div className="p-2 rounded-xl border border-gray-200 bg-white/60 text-sm">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-900">Ujian Basis Data</div>
                <div className="text-gray-600">Jum 10:00</div>
              </div>
              <div className="mt-1 text-[11px] text-gray-600">Ruang: Aula-1</div>
            </div>
            <div className="p-2 rounded-xl border border-gray-200 bg-white/60 text-sm">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-900">Bimbingan TA</div>
                <div className="text-gray-600">Sab 13:00</div>
              </div>
              <div className="mt-1 text-[11px] text-gray-600">Ruang: R-207</div>
            </div>
          </div>
        </div>
      </section>
    </DosenLayout>
  );
}
