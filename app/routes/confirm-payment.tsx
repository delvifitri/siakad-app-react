import { useNavigate, useLocation } from "react-router-dom";
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
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Channel Pembayaran</h3>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {currentSelectedChannel.id.includes('bca') || currentSelectedChannel.id.includes('bni') || currentSelectedChannel.id.includes('mandiri') || currentSelectedChannel.id.includes('bri') ? '🏦' :
                 currentSelectedChannel.id.includes('visa') || currentSelectedChannel.id.includes('mastercard') ? '💳' : '📱'}
              </span>
              <div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-200">{currentSelectedChannel.name}</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">{currentSelectedChannel.details}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Detail Pembayaran</h3>
          <div className="space-y-4">
            {/* Semester Info */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <CalendarDaysIcon className="w-5 h-5 text-yellow-600" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Semester {currentPaymentDetails.semester}</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">Batas Pembayaran: {currentPaymentDetails.dueDate}</p>
                </div>
              </div>
            </div>

            {/* Payment Breakdown */}
            {currentPaymentDetails.breakdown && currentPaymentDetails.breakdown.map((item: { item: string; amount: number }, index: number) => {
              const colors = [
                { bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-200 dark:border-blue-800", text: "text-blue-800 dark:text-blue-200", amount: "text-blue-900 dark:text-blue-100" },
                { bg: "bg-green-50 dark:bg-green-900/20", border: "border-green-200 dark:border-green-800", text: "text-green-800 dark:text-green-200", amount: "text-green-900 dark:text-green-100" },
                { bg: "bg-purple-50 dark:bg-purple-900/20", border: "border-purple-200 dark:border-purple-800", text: "text-purple-800 dark:text-purple-200", amount: "text-purple-900 dark:text-purple-100" },
                { bg: "bg-indigo-50 dark:bg-indigo-900/20", border: "border-indigo-200 dark:border-indigo-800", text: "text-indigo-800 dark:text-indigo-200", amount: "text-indigo-900 dark:text-indigo-100" },
                { bg: "bg-pink-50 dark:bg-pink-900/20", border: "border-pink-200 dark:border-pink-800", text: "text-pink-800 dark:text-pink-200", amount: "text-pink-900 dark:text-pink-100" }
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

            <hr className="border-gray-200 dark:border-gray-700" />
            <div className="flex justify-between items-center text-lg font-bold bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
              <span className="text-purple-800 dark:text-purple-200">Total Pembayaran</span>
              <span className="text-purple-900 dark:text-purple-100">Rp {(currentPaymentDetails.amount || currentPaymentDetails.breakdown?.reduce((sum: number, item: { item: string; amount: number }) => sum + item.amount, 0) || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleContinuePayment}
            className="w-full bg-blue-500 text-white py-4 px-6 rounded-3xl font-semibold text-lg hover:bg-blue-600 transition-colors shadow-lg"
          >
            Lanjut Bayar
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