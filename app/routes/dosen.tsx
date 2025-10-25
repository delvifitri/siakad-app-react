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
  ClipboardDocumentCheckIcon,
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
          <p className="text-2xl font-bold">Selamat datang, Budi 👋</p>
        </div>

        {/* Kartu Ringkasan Cepat */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="block">
          <StatCard wrapTitle icon={<DocumentTextIcon className="w-6 h-6 text-blue-600" />} title="Mata Kuliah Aktif" value={activeCourses} />
          </div>
          <a href="/dosen/bimbingan" className="block" aria-label="Lihat Bimbingan">
          <StatCard wrapTitle icon={<UserGroupIcon className="w-6 h-6 text-green-600" />} title="Lihat Bimbingan" value={bimbinganCount} />
          </a>
          <a href="/status-krs" className="block" aria-label="Approve KRS">
          <StatCard wrapTitle icon={<DocumentCheckIcon className="w-6 h-6 text-purple-600" />} title="Approve KRS" value={krsPending} />
          </a>
          <div className="block">
          <StatCard wrapTitle icon={<AcademicCapIcon className="w-6 h-6 text-orange-500" />} title="Ujian Minggu Ini" value={examsThisWeek} />
          </div>
        </div>

        {/* Shortcut Aksi Cepat */}
  <div className="grid grid-cols-3 gap-3 mt-6">
  <QuickAction size="lg" centered icon={<AcademicCapIcon className="w-7 h-7 mb-2 text-white" />} label="Input Nilai" className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white" to="/dosen/nilai-presensi" />
  <QuickAction size="lg" centered icon={<CalendarDaysIcon className="w-7 h-7 mb-2 text-white" />} label="Lihat Jadwal" className="bg-gradient-to-br from-sky-500 to-blue-600 text-white" to="/schedule" />
  <QuickAction size="lg" centered icon={<ClipboardDocumentCheckIcon className="w-7 h-7 mb-2 text-white" />} label="Input Presensi" className="bg-gradient-to-br from-emerald-500 to-green-600 text-white" to="/dosen/nilai-presensi" />
        </div>

        {/* Berita Kampus untuk Dosen */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">Berita Kampus</h2>
            <a href="/dosen/news" className="text-sm font-medium text-orange-600">Read more</a>
          </div>
          <div className="space-y-3">
            <NewsItem title="Rapat Dosen Mingguan: Agenda Kurikulum" to="/news/3" day="12" month="Okt" />
            <NewsItem title="Pembukaan Hibah Penelitian Internal 2025" to="/news/4" day="15" month="Okt" />
          </div>
        </div>

        {/* Jadwal dipindahkan ke halaman Lihat Jadwal */}
      </section>
    </DosenLayout>
  );
}
