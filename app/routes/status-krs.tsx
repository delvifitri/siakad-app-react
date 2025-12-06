import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import MobileLayout from "../layouts/MobileLayout";
import { authService } from "../services/auth.service";
import { statusKrsService } from "../services/status-krs.service";
import type { StatusKrsResponse } from "../schemas/status-krs.schema";

export function meta() {
  return [
    { title: "Status KRS - Siakad" },
    { name: "description", content: "Status pengajuan KRS ke Dosen PA" },
  ];
}

export default function StatusKrs() {
  const navigate = useNavigate();
  const [statusKrsData, setStatusKrsData] = useState<StatusKrsResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Fetch data when component mounts
  useEffect(() => {
    fetchStatusKrsData();
  }, []);

  const fetchStatusKrsData = async () => {
    try {
      const data = await statusKrsService.getStatusKrs();
      setStatusKrsData(data);
    } catch (err: any) {
      if (err.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      setError(err.message || "Failed to load status KRS data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <MobileLayout title="Status KRS" showNav={true} bgImage="/bg simple.png">
        <div className="flex items-center justify-center min-h-app">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (error || !statusKrsData) {
    return (
      <MobileLayout title="Status KRS" showNav={true} bgImage="/bg simple.png">
        <div className="flex items-center justify-center min-h-app">
          <div className="text-center">
            <p className="text-red-600 mb-4">
              {error || "Failed to load data"}
            </p>
            <button
              onClick={fetchStatusKrsData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  const { data } = statusKrsData;

  // Group mata kuliah by status
  const approved = data.mata_kuliah.filter((mk) => mk.status === "Disetujui");
  const pending = data.mata_kuliah.filter((mk) => mk.status === "Menunggu");
  const rejected = data.mata_kuliah.filter((mk) => mk.status === "Ditolak");

  // Get status badge color
  const getStatusBadgeColor = (statusColor: string) => {
    switch (statusColor) {
      case "success":
        return "bg-green-100 text-green-700";
      case "warning":
        return "bg-yellow-100 text-yellow-700";
      case "danger":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <MobileLayout title="Status KRS" showNav={true} bgImage="/bg simple.png">
      <div className="p-4 space-y-4">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold text-gray-900">
            Status Pengajuan KRS
          </h1>
          <p className="text-sm text-gray-600">
            Dosen PA:{" "}
            <span className="font-medium text-gray-800">
              {data.dosen_pa ? data.dosen_pa.nama : "-"}
            </span>
          </p>
          {/* Semester aktif */}
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
            <span>Semester {data.semester}</span>
            <span className="text-[11px] text-blue-600">
              ({data.tahun_ajaran})
            </span>
          </div>
        </header>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-800">Ringkasan:</span>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
            {data.ringkasan}
          </span>
        </div>

        {approved.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-800 mb-2">
              Disetujui ({approved.length})
            </h2>
            <ul className="space-y-2">
              {approved.map((mk) => (
                <li
                  key={mk.id}
                  className="flex items-center justify-between bg-white/70 backdrop-blur-md rounded-xl px-3 py-2 ring-1 ring-gray-200"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {mk.nama_mk}
                    </p>
                    <p className="text-xs text-gray-600">
                      {mk.kelas_text} {mk.kelas} • {mk.sks} SKS
                    </p>
                  </div>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${getStatusBadgeColor(mk.status_color)}`}
                  >
                    {mk.status}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {pending.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-800 mb-2">
              Menunggu Persetujuan ({pending.length})
            </h2>
            <ul className="space-y-2">
              {pending.map((mk) => (
                <li
                  key={mk.id}
                  className="flex items-center justify-between bg-white/70 backdrop-blur-md rounded-xl px-3 py-2 ring-1 ring-gray-200"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {mk.nama_mk}
                    </p>
                    <p className="text-xs text-gray-600">
                      {mk.kelas_text} {mk.kelas} • {mk.sks} SKS
                    </p>
                  </div>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${getStatusBadgeColor(mk.status_color)}`}
                  >
                    {mk.status}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {rejected.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-800 mb-2">
              Ditolak ({rejected.length})
            </h2>
            <ul className="space-y-2">
              {rejected.map((mk) => (
                <li
                  key={mk.id}
                  className="flex items-center justify-between bg-white/70 backdrop-blur-md rounded-xl px-3 py-2 ring-1 ring-gray-200"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {mk.nama_mk}
                    </p>
                    <p className="text-xs text-gray-600">
                      {mk.kelas_text} {mk.kelas} • {mk.sks} SKS
                    </p>
                  </div>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${getStatusBadgeColor(mk.status_color)}`}
                  >
                    {mk.status}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="h-8" />
      </div>
    </MobileLayout>
  );
}
