import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import SimpleLayout from "../layouts/SimpleLayout";
import { CreditCardIcon, CalendarDaysIcon, BanknotesIcon } from "@heroicons/react/24/outline";
import { defaultPaymentDetails } from "../data/paymentData";

export default function ConfirmPayment() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get data from navigation state
  const { selectedChannel, paymentDetails } = location.state || {};

  const currentPaymentDetails = paymentDetails || defaultPaymentDetails;

  // Default selected channel if not provided
  const currentSelectedChannel = selectedChannel || {
    id: "bca",
    name: "BCA",
    shortName: "BCA",
    details: "Transfer ke rekening BCA 1234567890 a.n Universitas"
  };

  // Countdown timer for payment time window (e.g., 15 minutes)
  const DURATION_SEC = 15 * 60;
  const [endAt] = useState<number>(() => Date.now() + DURATION_SEC * 1000);
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const remainingSec = Math.max(0, Math.floor((endAt - now) / 1000));
  const isExpired = remainingSec <= 0;
  const timeStr = useMemo(() => {
    const m = Math.floor(remainingSec / 60).toString().padStart(2, "0");
    const s = Math.floor(remainingSec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [remainingSec]);

  const handleContinuePayment = () => {
    // Navigate to actual payment processing
    alert(`Memproses pembayaran dengan ${currentSelectedChannel.name}`);
  };

  const handleChangePayment = () => {
    navigate("/select-payment", {
      state: { paymentDetails: currentPaymentDetails }
    });
  };

  return (
    <SimpleLayout title="Konfirmasi Pembayaran">
      <div className="space-y-6">
        {/* Payment Channel Selected */}
        <div className="bg-white/90  backdrop-blur-sm rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Channel Pembayaran</h3>
          <div className="bg-blue-50  border border-blue-200  rounded-xl p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {currentSelectedChannel.id.includes('bca') || currentSelectedChannel.id.includes('bni') || currentSelectedChannel.id.includes('mandiri') || currentSelectedChannel.id.includes('bri') ? '🏦' :
                 currentSelectedChannel.id.includes('visa') || currentSelectedChannel.id.includes('mastercard') ? '💳' : '📱'}
              </span>
              <div>
                <h4 className="font-semibold text-blue-800 ">{currentSelectedChannel.name}</h4>
                <p className="text-sm text-blue-700 ">{currentSelectedChannel.details}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white/90  backdrop-blur-sm rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Detail Pembayaran</h3>
          <div className="space-y-4">
            {/* Countdown (Replace semester and due date) */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <CalendarDaysIcon className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-blue-800">Waktu Pembayaran</h4>
                  <p className={`text-lg font-bold ${isExpired ? "text-red-700" : "text-blue-900"}`}>{timeStr}</p>
                </div>
              </div>
              {isExpired && (
                <p className="mt-2 text-sm text-red-700">Waktu pembayaran habis. Silakan kembali dan mulai ulang.</p>
              )}
            </div>

            {/* Payment Breakdown */}
            {currentPaymentDetails.breakdown && currentPaymentDetails.breakdown.map((item: { item: string; amount: number }, index: number) => {
              const colors = [
                { bg: "bg-blue-50 ", border: "border-blue-200 ", text: "text-blue-800 ", amount: "text-blue-900 " },
                { bg: "bg-green-50 ", border: "border-green-200 ", text: "text-green-800 ", amount: "text-green-900 " },
                { bg: "bg-purple-50 ", border: "border-purple-200 ", text: "text-purple-800 ", amount: "text-purple-900 " },
                { bg: "bg-indigo-50 ", border: "border-indigo-200 ", text: "text-indigo-800 ", amount: "text-indigo-900 " },
                { bg: "bg-pink-50 ", border: "border-pink-200 ", text: "text-pink-800 ", amount: "text-pink-900 " }
              ];
              const colorScheme = colors[index % colors.length];

              return (
                <div key={index} className={`flex justify-between items-center ${colorScheme.bg} rounded-xl p-4 border ${colorScheme.border}`}>
                  <div className="flex items-center gap-3">
                    <BanknotesIcon className={`w-5 h-5 ${index === 0 ? 'text-blue-600' : index === 1 ? 'text-green-600' : 'text-purple-600'}`} />
                    <span className={`font-medium ${colorScheme.text}`}>{item.item}</span>
                  </div>
                  <span className={`font-semibold ${colorScheme.amount}`}>Rp {item.amount.toLocaleString()}</span>
                </div>
              );
            })}

            <hr className="border-gray-200 " />
            <div className="flex justify-between items-center text-lg font-bold bg-purple-50  rounded-xl p-4 border border-purple-200 ">
              <span className="text-purple-800 ">Total Pembayaran</span>
              <span className="text-purple-900 ">Rp {(currentPaymentDetails.amount || currentPaymentDetails.breakdown?.reduce((sum: number, item: { item: string; amount: number }) => sum + item.amount, 0) || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleContinuePayment}
            disabled={isExpired}
            className={`w-full py-4 px-6 rounded-3xl font-semibold text-lg transition-colors shadow-lg ${
              isExpired
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {isExpired ? "Waktu Habis" : "Lanjut Bayar"}
          </button>
          <button
            onClick={handleChangePayment}
            className="w-full bg-orange-500 text-white py-4 px-6 rounded-3xl font-semibold text-lg hover:bg-orange-600 transition-colors shadow-lg"
          >
            Ubah Pembayaran
          </button>
        </div>
      </div>
    </SimpleLayout>
  );
}