import { useNavigate } from "react-router-dom";
import SimpleLayout from "../layouts/SimpleLayout";
import { CreditCardIcon, CalendarDaysIcon, BanknotesIcon } from "@heroicons/react/24/outline";

export default function Pembayaran() {
  const navigate = useNavigate();
  const paymentDetails = {
    semester: "Ganjil 2025/2026",
    uktSppAmount: 3000000,
    praktikumAmount: 200000,
    totalAmount: 3200000,
    dueDate: "15 November 2025",
    status: "Belum Dibayar",
  };

  const handlePayment = () => {
    navigate("/select-payment");
  };

  return (
    <SimpleLayout title="Pembayaran">
      <div className="space-y-4">
        {/* Payment Status and Due Date */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Status Pembayaran</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              paymentDetails.status === "Belum Dibayar"
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            }`}>
              {paymentDetails.status}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Semester {paymentDetails.semester}</p>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <CalendarDaysIcon className="w-5 h-5 text-yellow-600" />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 text-sm">Batas Pembayaran</h4>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">{paymentDetails.dueDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
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
            <hr className="border-gray-200 dark:border-gray-700" />
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Pembayaran</span>
              <span>Rp {paymentDetails.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          className="w-full bg-orange-500 text-white py-4 px-6 rounded-3xl font-semibold text-lg hover:bg-orange-600 transition-colors shadow-lg"
        >
          Bayar Sekarang
        </button>
      </div>
    </SimpleLayout>
  );
}
