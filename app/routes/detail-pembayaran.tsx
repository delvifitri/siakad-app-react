import { useNavigate, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { paymentList } from "../data/paymentData";
import SimpleLayout from "../layouts/SimpleLayout";
import { CreditCardIcon, BanknotesIcon } from "@heroicons/react/24/outline";

export default function Pembayaran() {
  const navigate = useNavigate();
  // Mock daftar tagihan per semester
  const bills = [
    {
      id: "2025-ganjil",
      semester: "Ganjil 2025/2026",
      uktSppAmount: 3000000,
      praktikumAmount: 200000,
      totalAmount: 3200000,
      dueDate: "15 November 2025",
      status: "Belum Dibayar" as const,
    },
    {
      id: "2025-genap",
      semester: "Genap 2024/2025",
      uktSppAmount: 3000000,
      praktikumAmount: 0,
      totalAmount: 3000000,
      dueDate: "15 Mei 2025",
      status: "Sudah Dibayar" as const,
    },
    {
      id: "2024-ganjil",
      semester: "Ganjil 2024/2025",
      uktSppAmount: 2950000,
      praktikumAmount: 150000,
      totalAmount: 3100000,
      dueDate: "15 November 2024",
      status: "Sudah Dibayar" as const,
    },
  ];

  const [searchParams, setSearchParams] = useSearchParams();
  // Mapping tahun/season per Semester (urutan dari atas = Semester 1 dst)
  const preset = useMemo(
    () => [
      { year: "2020/2021", season: "Ganjil" },
      { year: "2021/2022", season: "Genap" },
      { year: "2023/2024", season: "Ganjil" },
      { year: "2024/2025", season: "Genap" },
    ],
    []
  );

  const semParam = searchParams.get("sem");
  const semIndex = useMemo(() => {
    const n = parseInt(semParam || "1", 10);
    if (!Number.isFinite(n) || n < 1) return 0;
    return Math.min(n - 1, preset.length - 1);
  }, [semParam, preset.length]);

  // Ambil bill berdasarkan semIndex (fallback ke index 0 jika tidak ada)
  const paymentDetails = bills[semIndex] ?? bills[0];

  const semesterLabel = `Semester ${semIndex + 1}`;
  const academicYear = preset[semIndex]?.year || "";
  const season = preset[semIndex]?.season || "";

  const formatRp = (n: number) => `Rp ${n.toLocaleString()}`;

  const paymentItems = useMemo(
    () => {
      const baseItems = [
        {
          key: "ukt",
          title: "UKT / SPP",
          amount: paymentDetails.uktSppAmount,
          icon: <BanknotesIcon className="w-5 h-5 text-blue-600" />,
          paid: paymentDetails.status === "Sudah Dibayar",
        },
        {
          key: "praktikum",
          title: "Praktikum",
          amount: paymentDetails.praktikumAmount,
          icon: <CreditCardIcon className="w-5 h-5 text-green-600" />,
          paid: paymentDetails.status === "Sudah Dibayar",
        },
        // Tambahan: Kegiatan Mahasiswa (selalu sudah lunas)
        {
          key: "kegiatan",
          title: "Kegiatan Mahasiswa",
          amount: 200000,
          icon: <CreditCardIcon className="w-5 h-5 text-indigo-600" />,
          paid: true,
        },
      ];
      return baseItems.filter((i) => i.amount > 0);
    },
    [paymentDetails]
  );

  const handlePayItem = (type: string) => {
    // Sertakan semester terpilih agar halaman pay-now bisa menampilkan ringkasan yang sesuai
    const params = new URLSearchParams({ type, sem: String(semIndex + 1) });
    navigate(`/pay-now?${params.toString()}`);
  };

  return (
    <SimpleLayout title="Pembayaran">
      <div className="space-y-4">
        {/* Semester Bill Selector */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">Pilih Tagihan Semester</span>
            <select
              className="text-sm px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
              value={String(semIndex + 1)}
              onChange={(e) => setSearchParams({ sem: e.target.value })}
              aria-label="Pilih tagihan semester"
            >
              {preset.map((p, i) => (
                <option key={`${p.year}-${p.season}`} value={String(i + 1)}>
                  {`Semester ${i + 1}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Header info + section title inside a single glass card */}
        <div className="rounded-2xl p-6 shadow-sm bg-white/30 backdrop-blur-md ring-1 ring-white/30">
          <div className="text-gray-800">
            <p className="text-xl font-bold text-gray-900">{semesterLabel}</p>
            {(academicYear || season) && (
              <p className="text-sm text-gray-600">({academicYear} {season})</p>
            )}
          </div>
          <div className="mt-4">
            <h2 className="text-base font-semibold text-gray-900">Daftar Jenis Pembayaran</h2>
          </div>
        </div>

  {/* Payment items list */}
        <div className="space-y-3">
          {paymentItems.map((item) => {
            const isPaid = item.paid;
            return (
              <div
                key={item.key}
                className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-700">{formatRp(item.amount)}</p>
                      <p className={`text-xs ${isPaid ? "text-green-600" : "text-gray-500"}`}>
                        {isPaid ? "Sudah Lunas" : "Belum Dibayar"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={() => handlePayItem(item.key)}
                    disabled={isPaid}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold shadow ${
                      isPaid
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-orange-500 text-white hover:bg-orange-600"
                    }`}
                  >
                    {isPaid ? "Sudah Lunas" : "Bayar Ini"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        {(() => {
          const total = paymentItems.reduce((sum, it) => sum + it.amount, 0);
          const paid = paymentItems.filter((it) => it.paid).reduce((sum, it) => sum + it.amount, 0);
          const remaining = total - paid;
          return (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Total Tagihan Semester Ini:</span>
                <span className="font-semibold">{formatRp(total)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Sudah Dibayar</span>
                <span className="font-semibold text-green-700">{formatRp(paid)}</span>
              </div>
              <hr className="border-gray-200 my-2" />
              <div className="flex justify-between text-sm">
                <span>Sisa</span>
                <span className="font-semibold text-red-700">{formatRp(remaining)}</span>
              </div>
            </div>
          );
        })()}
      </div>
    </SimpleLayout>
  );
}
