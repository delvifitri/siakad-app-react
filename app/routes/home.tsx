import type { Route } from "./+types/home";
import MobileLayout from "../layouts/MobileLayout";
import HeaderIcons from "../components/HeaderIcons";
import NewsItem from "../components/NewsItem";
import {
  CalendarDaysIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  DocumentDuplicateIcon,
  UserGroupIcon,
  DocumentTextIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/outline";
import QuickAction from "../components/QuickAction";
import StatCard from "../components/StatCard";
import { useKrsContext } from "../context/KrsContext";
import { khsData, gradePoint } from "../data/khsData";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Siakad - Home" },
    { name: "description", content: "Halaman utama aplikasi Siakad" },
  ];
}

export default function Home() {
  const { submission } = useKrsContext();
  const approvedCount = submission.items.filter((i) => i.status === "disetujui").length;
  const totalCount = submission.items.length || 20;
  const summary = submission.submitted ? `${approvedCount}/${totalCount} Disetujui` : "19/20 Disetujui";

  // Hitung IPK terbaru dari data KHS bersama
  const semesters = Object.keys(khsData).map(Number).sort((a, b) => a - b);
  let cumSks = 0;
  let cumNxS = 0;
  for (const s of semesters) {
    const sem = khsData[s];
    if (!sem) continue;
    cumSks += sem.courses.reduce((sum, c) => sum + c.sks, 0);
    cumNxS += sem.courses.reduce((sum, c) => sum + gradePoint(c.grade) * c.sks, 0);
  }
  const latestIpk = cumSks > 0 ? cumNxS / cumSks : 0;
  // Total SKS dari data IPK (kumulatif lulus). Default: lulus jika gradePoint > 0
  const totalSks = semesters.reduce((sum, s) => {
    const sem = khsData[s];
    if (!sem) return sum;
    const sksLulus = sem.courses
      .filter((c) => gradePoint(c.grade) > 0)
      .reduce((acc, c) => acc + c.sks, 0);
    return sum + sksLulus;
  }, 0);
  return (
    <MobileLayout title="Siakad" bgImage="/bg white.png">
      <HeaderIcons />

      <section className="px-4 mt-6">
        <div className="text-black">
          <p className="text-4xl font-bold">Halo, Budi!</p>
          <p className="text-2x1 mt-1 opacity-90">Informatika (123456789)</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <a href="/krs-khs?tab=ipk" className="block" aria-label="Lihat IPK">
            <StatCard
              icon={<AcademicCapIcon className="w-6 h-6 text-blue-600" />}
              title="IPK"
              value={latestIpk.toFixed(2)}
            />
          </a>
          <StatCard
            icon={<DocumentDuplicateIcon className="w-6 h-6 text-green-600" />}
            title="Total SKS"
            value={totalSks}
          />
          <a href="/krs-khs?tab=khs" className="block">
            <StatCard
              icon={<DocumentTextIcon className="w-6 h-6 text-orange-500" />}
              title="KRS / KHS"
              value="Lihat"
            />
          </a>
          <a href="/status-krs" className="block">
            <StatCard
              icon={<DocumentCheckIcon className="w-6 h-6 text-purple-600" />}
              title="Status KRS"
              value={summary}
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
            icon={<CreditCardIcon className="w-7 h-7 mb-2 text-white" />}
            label="Pembayaran"
            className="bg-gradient-to-br from-orange-400 to-amber-500 text-white"
            to="/detail-pembayaran"
          />
          <QuickAction
            icon={<ShieldCheckIcon className="w-7 h-7 mb-2 text-blue-600" />}
            label="Pengajuan"
            className="bg-white text-blue-600 border border-gray-200"
          />
        </div>

        <div className="mt-3">
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            Berita Kampus
          </h2>
          <div className="space-y-3">
            <NewsItem
              title="Pendaftaran Beasiswa Dibuka"
              to="/news/1"
              day="07"
              month="Sep"
            />

            <NewsItem
              title="Seminar Industri Minggu Ini"
              to="/news/2"
              day="17"
              month="Des"
            />
          </div>
        </div>
      </section>
    </MobileLayout>
  );
}
