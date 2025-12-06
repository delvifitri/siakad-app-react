import type { Route } from "./+types/home";
import { useNavigate, Navigate, Link } from "react-router";
import { useEffect, useState } from "react";
import MobileLayout from "../layouts/MobileLayout";
import HeaderIcons from "../components/HeaderIcons";
import NewsItem from "../components/NewsItem";
import {
  CalendarDaysIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/outline";
import QuickAction from "../components/QuickAction";
import StatCard from "../components/StatCard";
import { authService } from "../services/auth.service";
import { homeService } from "../services/home.service";
import type { HomeResponse } from "../schemas/home.schema";

// No loader - authentication will be checked client-side

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Siakad - Home" },
    { name: "description", content: "Halaman utama aplikasi Siakad" },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const [homeData, setHomeData] = useState<HomeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication immediately, return Navigate component if not authenticated
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Fetch data when component mounts
  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const data = await homeService.getHomeData();
      setHomeData(data);
    } catch (err: any) {
      // Don't show error message for auth errors, just redirect
      if (err.status === 401) {
        navigate("/login", { replace: true });
        return;
      }

      
      setError(err.message || "Failed to load home data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <MobileLayout title="Siakad" bgImage="/bg white.png">
        <div className="flex items-center justify-center min-h-app">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            {/* <p className="text-gray-600">Loading...</p> */}
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (error || !homeData) {
    return (
      <MobileLayout title="Siakad" bgImage="/bg white.png">
        <div className="flex items-center justify-center min-h-app">
          <div className="text-center">
            <p className="text-red-600 mb-4">
              {error || "Failed to load data"}
            </p>
            <button
              onClick={fetchHomeData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  const { data } = homeData;

  // Reorder stats by ID based on API response order (1: IPK, 2: Total SKS, 3: SKS/KHS, 4: Status KRS)
  const reorderedStats = data.stats.sort((a, b) => a.id - b.id);

  // Helper function to get icon for stat
  const getStatIcon = (statName: string) => {
    switch (statName) {
      case "IPK":
        return <AcademicCapIcon className="w-6 h-6 text-blue-600" />;
      case "Total SKS":
        return <DocumentDuplicateIcon className="w-6 h-6 text-green-600" />;
      case "SKS / KHS":
        return <DocumentTextIcon className="w-6 h-6 text-orange-500" />;
      case "Status KRS":
        return <DocumentCheckIcon className="w-6 h-6 text-purple-600" />;
      default:
        return <AcademicCapIcon className="w-6 h-6 text-blue-600" />;
    }
  };

  // Helper function to format value display
  const formatValue = (statName: string, value: string | number): string | number => {
    if (statName === "SKS / KHS" && value === "Lihat") {
      return "Lihat →";
    }
    return value;
  };

  // Format date for news
  const formatNewsDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleDateString("id-ID", { month: "short" });
    return { day, month };
  };

  return (
    <MobileLayout title="Siakad" bgImage="/bg white.png">
      <HeaderIcons />

      <section className="px-4 mt-6">
        <div className="text-black">
          <p className="text-3xl font-bold">
            Halo, {data.profile.full_name.split(" ")[0]}!
          </p>
          <p className="text-md mt-1 opacity-90">
            {data.profile.program_studi} ({data.profile.nim})
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          {reorderedStats.map((stat) => {
            // Only make Status KRS clickable (ID: 4) since it's the only route that exists
            if (stat.id === 4) {
              return (
                <Link
                  key={stat.id}
                  to="/status-krs"
                  className="block"
                  aria-label="Lihat Status KRS"
                >
                  <StatCard
                    icon={getStatIcon(stat.name)}
                    title={stat.name}
                    value={formatValue(stat.name, stat.value)}
                  />
                </Link>
              );
            }

            return (
              <div key={stat.id} className="cursor-default">
                <StatCard
                  icon={getStatIcon(stat.name)}
                  title={stat.name}
                  value={formatValue(stat.name, stat.value)}
                />
              </div>
            );
          })}
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
            to="/pengajuan"
          />
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">
              Berita Kampus
            </h2>
            <a href="/news" className="text-sm font-medium text-orange-600">
              Read more
            </a>
          </div>
          <div className="space-y-3">
            {data.news.slice(0, 2).map((newsItem) => {
              const { day, month } = formatNewsDate(newsItem.tgl_publish);
              return (
                <NewsItem
                  key={newsItem.id}
                  title={newsItem.judul}
                  to={`/news/${newsItem.id}`}
                  day={day}
                  month={month}
                />
              );
            })}
          </div>
        </div>
      </section>
    </MobileLayout>
  );
}
