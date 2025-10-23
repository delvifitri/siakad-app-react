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
  const krsPending = krsWaiting.length;
  const bimbinganCount = 12; // dummy
  const newMessages = 2; // dummy

  return (
    <DosenLayout title="Siakad" bgImage="/bg white.png">
      <HeaderIcons />

      <section className="px-4 mt-6">
        <div className="text-black">
          <p className="text-4xl font-bold">Halo, Dosen!</p>
          <p className="text-2x1 mt-1 opacity-90">Teknik Informatika (NIP 1987654321)</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <a href="/schedule" className="block" aria-label="Lihat Jadwal">
            <StatCard
              icon={<CalendarDaysIcon className="w-6 h-6 text-blue-600" />}
              title="Kelas Hari Ini"
              value={classesToday}
            />
          </a>
          <div className="block">
            <StatCard
              icon={<UserGroupIcon className="w-6 h-6 text-green-600" />}
              title="Mahasiswa Bimbingan"
              value={bimbinganCount}
            />
          </div>
          <a href="/status-krs" className="block">
            <StatCard
              icon={<DocumentCheckIcon className="w-6 h-6 text-purple-600" />}
              title="KRS Menunggu"
              value={krsPending}
            />
          </a>
          <a href="/messages" className="block">
            <StatCard
              icon={<ChatBubbleLeftEllipsisIcon className="w-6 h-6 text-orange-500" />}
              title="Pesan Baru"
              value={newMessages}
            />
          </a>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <QuickAction
            icon={<CalendarDaysIcon className="w-7 h-7 mb-2 text-white" />}
            label="Jadwal"
            className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
            to="/schedule"
          />
          <QuickAction
            icon={<DocumentTextIcon className="w-7 h-7 mb-2 text-white" />}
            label="KRS"
            className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white"
            to="/status-krs"
          />
          <QuickAction
            icon={<ChatBubbleLeftEllipsisIcon className="w-7 h-7 mb-2 text-blue-600" />}
            label="Pesan"
            className="bg-white text-blue-600 border border-gray-200"
            to="/messages"
          />
        </div>

        <div className="mt-3">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Berita Kampus</h2>
          <div className="space-y-3">
            <NewsItem title="Input Nilai UTS Dibuka" to="/news/1" day="07" month="Sep" />
            <NewsItem title="Rapat Dosen Minggu Ini" to="/news/2" day="17" month="Des" />
          </div>
        </div>
      </section>
    </DosenLayout>
  );
}
