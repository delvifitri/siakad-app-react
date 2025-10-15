import { useNavigate, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { paymentList } from "../data/paymentData";
import SimpleLayout from "../layouts/SimpleLayout";
import { CreditCardIcon, CalendarDaysIcon, BanknotesIcon } from "@heroicons/react/24/outline";

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

  const [searchParams] = useSearchParams();
  const semesterQuery = searchParams.get("semester");
  const initialBillId = useMemo(() => {
    if (!semesterQuery) return bills[0]?.id ?? "";
    const match = bills.find(b => b.semester.toLowerCase() === semesterQuery.toLowerCase());
    return match ? match.id : (bills[0]?.id ?? "");
  }, [semesterQuery]);

  const [selectedBillId, setSelectedBillId] = useState<string>(initialBillId);
  const paymentDetails = useMemo(() => {
    return bills.find((b) => b.id === selectedBillId) ?? bills[0];
  }, [bills, selectedBillId]);

  // Samakan penamaan semester seperti di menu pembayaran per semester (Semester 1, 2, ...)
  const semesterOrder = useMemo(() => Array.from(new Set(paymentList.map(p => p.semester))), []);
  const semesterIndex = semesterOrder.indexOf(paymentDetails.semester);
  const semesterLabel = semesterIndex >= 0 ? `Semester ${semesterIndex + 1}` : paymentDetails.semester;
  const seasonMatch = paymentDetails.semester.match(/\b(Ganjil|Genap)\b/i);
  const yearMatch = paymentDetails.semester.match(/\b(\d{4}\/\d{4})\b/);

  const handlePayment = () => {
    // Teruskan konteks tagihan yang dipilih (opsional untuk dipakai di halaman berikutnya)
    const params = new URLSearchParams({ billId: paymentDetails.id, semester: paymentDetails.semester });
    navigate(`/select-payment?${params.toString()}`);
  };

  return (
    <SimpleLayout title="Pembayaran">
      <div className="space-y-4">
        {/* Semester Bill Selector */}
        <div className="bg-white  rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">Pilih Tagihan Semester</span>
            <select
              className="text-sm px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
              value={selectedBillId}
              onChange={(e) => setSelectedBillId(e.target.value)}
              aria-label="Pilih tagihan semester"
            >
              {bills.map((b) => (
                <option key={b.id} value={b.id}>{b.semester}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Payment Status and Due Date */}
        <div className="bg-white  rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Status Pembayaran</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              paymentDetails.status === "Belum Dibayar"
                ? "bg-red-100 text-red-800  "
                : "bg-green-100 text-green-800  "
            }`}>
              {paymentDetails.status}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <span className="font-medium">{semesterLabel}</span>
            {yearMatch && <span className="text-xs">{yearMatch[1]}</span>}
            {seasonMatch && (
              <span className="text-[11px] px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                {seasonMatch[1]}
              </span>
            )}
          </div>
          <div className="bg-yellow-50  border border-yellow-200  rounded-xl p-4">
            <div className="flex items-center gap-3">
              <CalendarDaysIcon className="w-5 h-5 text-yellow-600" />
              <div>
                <h4 className="font-medium text-yellow-800  text-sm">Batas Pembayaran</h4>
                <p className="text-xs text-yellow-700 ">{paymentDetails.dueDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white  rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Rincian Pembayaran</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <BanknotesIcon className="w-5 h-5 text-blue-600" />
                <span>UKT/SPP</span>
              </div>
              <span className="font-medium">Rp {paymentDetails.uktSppAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <CreditCardIcon className="w-5 h-5 text-green-600" />
                <span>Praktikum</span>
              </div>
              <span className="font-medium">Rp {paymentDetails.praktikumAmount.toLocaleString()}</span>
            </div>
            <hr className="border-gray-200 " />
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Pembayaran</span>
              <span>Rp {paymentDetails.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={paymentDetails.status !== "Belum Dibayar"}
          className={`w-full py-4 px-6 rounded-3xl font-semibold text-lg transition-colors shadow-lg ${
            paymentDetails.status !== "Belum Dibayar"
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
        >
          Bayar Sekarang
        </button>
      </div>
    </SimpleLayout>
  );
}
