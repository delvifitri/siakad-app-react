import DosenLayout from "../layouts/DosenLayout";
import { useEffect, useMemo } from "react";
import { useKrsContext } from "../context/KrsContext";
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
  const displayName = useMemo(() => {
    try {
      const stored = localStorage.getItem('profileName');
      if (stored && stored.trim().length > 0) return stored;
      return 'Dr. Ahmad Fauzi';
    } catch {
      return 'Dr. Ahmad Fauzi';
    }
  }, []);
  const classesToday = scheduleToday.length;
  const { submission } = useKrsContext();
  const approvedCount = submission.items.filter((i) => i.status === "disetujui").length;
  const totalKrs = submission.items.length;
  // show demo values when there are no submissions yet (avoid 0/0)
  const displayApproved = totalKrs === 0 ? 12 : approvedCount;
  const displayTotal = totalKrs === 0 ? 20 : totalKrs;
  const krsSummary = `${displayApproved}/${displayTotal}`;
  // legacy single-number placeholder kept for compatibility where needed
  const krsPending = 3; // ringkas sesuai kartu
  const bimbinganCount = 12; // dummy
  const activeCourses = 5; // dummy mata kuliah aktif semester ini
  const examsThisWeek = 2; // dummy ujian minggu ini

  return (
    <DosenLayout title="Siakad" bgImage="/bg white.png">
      <HeaderIcons />

      <section className="px-4 mt-6">
        <div className="text-black">
          <p className="text-2xl font-bold">Selamat datang, {displayName} 👋</p>
        </div>

        {/* Kartu Ringkasan Cepat */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="block">
          <StatCard variant="small" wrapTitle icon={<CalendarDaysIcon className="w-6 h-6 text-blue-600" />} title="Mata Kuliah Aktif" value={activeCourses} />
          </div>
          <a href="/dosen/bimbingan-akademik" className="block" aria-label="Bimbingan Akademik">
          <StatCard variant="small" wrapTitle icon={<UserGroupIcon className="w-6 h-6 text-green-600" />} title="Bimbingan Akademik" value={bimbinganCount} />
          </a>
          <a href="/dosen/approve-krs" className="block" aria-label="Approve KRS">
          <StatCard variant="small" wrapTitle icon={<DocumentCheckIcon className="w-6 h-6 text-purple-600" />} title="Approve KRS" value={krsSummary} />
          </a>
          <div className="block">
          <StatCard variant="small" wrapTitle icon={<AcademicCapIcon className="w-6 h-6 text-orange-500" />} title="Ujian Pendadaran" value={examsThisWeek} />
          </div>
        </div>

        {/* Shortcut Aksi Cepat */}
  <div className="grid grid-cols-3 gap-3 mt-6">
  <QuickAction size="lg" centered icon={<AcademicCapIcon className="w-7 h-7 mb-2 text-white" />} label="Lihat Nilai" className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white" to="/dosen/nilai-presensi" />
  <QuickAction size="lg" centered icon={<CalendarDaysIcon className="w-7 h-7 mb-2 text-white" />} label="Input Presensi" className="bg-gradient-to-br from-sky-500 to-blue-600 text-white" to="/schedule" />
  <QuickAction size="lg" centered icon={<DocumentTextIcon className="w-7 h-7 mb-2 text-white" />} label="Bimbingan TA" className="bg-gradient-to-br from-emerald-500 to-green-600 text-white" to="/dosen/bimbingan" />
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

        {/* Jadwal dipindahkan ke halaman Input Presensi */}
      </section>
    </DosenLayout>
  );
}
