import { useNavigate, useParams } from "react-router-dom";
import SimpleLayout from "../layouts/SimpleLayout";
import { CreditCardIcon, CalendarDaysIcon, BanknotesIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { paymentDetails, type PaymentDetail } from "../data/paymentData";

export function meta() {
  return [{ title: "Detail Pembayaran - Siakad" }];
}

export default function PembayaranDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const payment: PaymentDetail | undefined = paymentDetails[id as keyof typeof paymentDetails];

  if (!payment) {
    return (
      <SimpleLayout title="Pembayaran Tidak Ditemukan">
        <div className="p-4">
          <h1 className="text-2xl font-semibold text-gray-900 ">Pembayaran Tidak Ditemukan</h1>
          <p className="mt-4 text-gray-700 ">Data pembayaran yang Anda cari tidak ditemukan.</p>
        </div>
      </SimpleLayout>
    );
  }

  const handlePayment = () => {
    navigate("/select-payment", {
      state: { paymentDetails: payment }
    });
  };

  return (
    <SimpleLayout title="Detail Pembayaran">
      <div className="space-y-6">

        {/* Payment Header */}
        <div className="bg-white/90  backdrop-blur-sm rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 ">{payment.type}</h1>
              <p className="text-sm text-gray-600 ">{payment.semester}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              payment.status === "Lunas"
                ? "bg-green-100 text-green-800  "
                : "bg-red-100 text-red-800  "
            }`}>
              {payment.status}
            </span>
          </div>

          <div className="bg-yellow-50  border border-yellow-200  rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <CalendarDaysIcon className="w-5 h-5 text-yellow-600" />
              <div>
                <h4 className="font-medium text-yellow-800  text-sm">Batas Pembayaran</h4>
                <p className="text-xs text-yellow-700 ">{payment.dueDate}</p>
              </div>
            </div>
          </div>

          <p className="text-gray-700  text-sm">{payment.description}</p>
        </div>

        {/* Payment Breakdown */}
        <div className="bg-white/90  backdrop-blur-sm rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Rincian Pembayaran</h3>
          <div className="space-y-4">
            {payment.breakdown.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2">
                <span className="text-gray-700 ">{item.item}</span>
                <span className="font-medium text-gray-900 ">Rp {item.amount.toLocaleString()}</span>
              </div>
            ))}
            <hr className="border-gray-200 " />
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Pembayaran</span>
              <span>Rp {payment.amount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        {payment.status !== "Lunas" && (
          <button
            onClick={handlePayment}
            className="w-full bg-orange-500 text-white py-4 px-6 rounded-3xl font-semibold text-lg hover:bg-orange-600 transition-colors shadow-lg"
          >
            Bayar Sekarang
          </button>
        )}
      </div>
    </SimpleLayout>
  );
}