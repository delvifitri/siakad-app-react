import type { Route } from "./+types/home";
import MobileLayout from "../layouts/MobileLayout";
import HeaderIcons from "../components/HeaderIcons";
import NewsItem from "../components/NewsItem";
import { CalendarDaysIcon, CreditCardIcon, ShieldCheckIcon, AcademicCapIcon, DocumentDuplicateIcon, UserGroupIcon, DocumentTextIcon, DocumentCheckIcon } from "@heroicons/react/24/outline";
import QuickAction from "../components/QuickAction";
import StatCard from "../components/StatCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Siakad - Home" },
    { name: "description", content: "Halaman utama aplikasi Siakad" },
  ];
}

export default function Home() {
  return (
    <MobileLayout title="Siakad" bgImage="/bg white.png">
      <HeaderIcons />

      <section className="px-4 mt-6">
        <div className="text-black">
          <p className="text-4xl font-bold">Halo, Budi!</p>
          <p className="text-2x1 mt-1 opacity-90">Informatika (123456789)</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <StatCard icon={<AcademicCapIcon className="w-6 h-6 text-blue-600" />} title="IPK" value={3.75} />
          <StatCard icon={<DocumentDuplicateIcon className="w-6 h-6 text-green-600" />} title="Total SKS" value={120} />
          <StatCard icon={<DocumentTextIcon className="w-6 h-6 text-orange-500" />} title="KRS / KHS" value="Lihat" />
          <StatCard icon={<DocumentCheckIcon className="w-6 h-6 text-purple-600" />} title="Status KRS" value="Disetujui" />
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
          <h2 className="text-base font-semibold text-gray-900 mb-3">Berita Kampus</h2>
          <div className="space-y-3">
            <NewsItem
              img="/favicon.ico"
              title="Pendaftaran Beasiswa Dibuka"
              excerpt="Pendaftaran beasiswa semester genap telah dibuka. Mahasiswa diharapkan menyiapkan berkas persyaratan sebelum tanggal tutup."
              to="/news/1"
            />

            <NewsItem
              img="/favicon.ico"
              title="Seminar Industri Minggu Ini"
              excerpt="Ikuti seminar bersama perusahaan mitra untuk insight karir dan peluang magang. Terbuka untuk seluruh mahasiswa."
              to="/news/2"
            />
          </div>
        </div>
      </section>
    </MobileLayout>
  );
}
