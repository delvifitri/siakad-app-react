import { useNavigate } from "react-router-dom";
import MobileLayout from "../layouts/MobileLayout";
import { CreditCardIcon, CalendarDaysIcon, BanknotesIcon } from "@heroicons/react/24/outline";
import { paymentList } from "../data/paymentData";

export function meta() {
  return [{ title: "Pembayaran - Siakad" }];
}

export default function Pembayaran() {
  const navigate = useNavigate();

  const handlePaymentClick = (paymentId: string) => {
    navigate(`/pembayaran/${paymentId}`);
  };

  return (
    <MobileLayout title="Pembayaran" bgImage="/bg simple.png">
      <div className="p-4 space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Daftar Pembayaran</h1>

        {paymentList.map((payment) => (
          <div
            key={payment.id}
            onClick={() => handlePaymentClick(payment.id)}
            className="rounded-xl p-1 cursor-pointer transition-shadow"
          >
            <div className="backdrop-blur-md bg-white/40 dark:bg-black/30 border border-white/20 dark:border-black/20 rounded-xl p-3 shadow-sm hover:shadow-md">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{payment.type}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{payment.semester}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                payment.status === "Lunas"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}>
                {payment.status}
              </span>
            </div>

              <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <BanknotesIcon className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  Rp {payment.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <CalendarDaysIcon className="w-3 h-3" />
                <span>{payment.dueDate}</span>
              </div>
            </div>
            </div>
          </div>
        ))}
      </div>
    </MobileLayout>
  );
}
