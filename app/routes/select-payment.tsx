import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SimpleLayout from "../layouts/SimpleLayout";
import { BuildingLibraryIcon, CreditCardIcon, WalletIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function SelectPayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  // Get payment details from navigation state
  const { paymentDetails } = location.state || {};

  // Default payment details
  const defaultPaymentDetails = {
    id: "ukt-2025-1",
    semester: "Ganjil 2025/2026",
    type: "UKT/SPP & Praktikum",
    amount: 3200000,
    dueDate: "15 November 2025",
    status: "Belum Dibayar",
    description: "Uang Kuliah Tunggal, Sumbangan Pengembangan Pendidikan, dan Biaya Praktikum",
    breakdown: [
      { item: "UKT Pokok", amount: 2500000 },
      { item: "SPP", amount: 500000 },
      { item: "Praktikum Kimia", amount: 80000 },
      { item: "Praktikum Fisika", amount: 60000 },
      { item: "Praktikum Biologi", amount: 60000 }
    ]
  };

  const currentPaymentDetails = paymentDetails || defaultPaymentDetails;

  const getPaymentIcon = (id: string) => {
    const iconMap: { [key: string]: string } = {
      // Banks
      'bca': '🏦',
      'bni': '🏛️',
      'mandiri': '🏢',
      'bri': '🏪',
      // Cards
      'visa-credit': '💳',
      'mastercard-credit': '💳',
      'visa-debit': '💳',
      'mastercard-debit': '💳',
      // E-wallets
      'dana': '💰',
      'ovo': '📱',
      'gopay': '💚',
      'shopeepay': '🛒',
    };
    return iconMap[id] || '💳';
  };

  const paymentChannels = {
    banks: [
      { id: "bca", name: "BCA", shortName: "BCA", details: "Transfer ke rekening BCA 1234567890 a.n Universitas" },
      { id: "bni", name: "BNI", shortName: "BNI", details: "Transfer ke rekening BNI 0987654321 a.n Universitas" },
      { id: "mandiri", name: "Mandiri", shortName: "Mandiri", details: "Transfer ke rekening Mandiri 1122334455 a.n Universitas" },
      { id: "bri", name: "BRI", shortName: "BRI", details: "Transfer ke rekening BRI 5566778899 a.n Universitas" },
    ],
    cards: [
      { id: "visa-credit", name: "Visa Credit Card", shortName: "Visa CC", details: "Masukkan detail kartu kredit Visa" },
      { id: "mastercard-credit", name: "Mastercard Credit", shortName: "MC CC", details: "Masukkan detail kartu kredit Mastercard" },
      { id: "visa-debit", name: "Visa Debit Card", shortName: "Visa DC", details: "Masukkan detail kartu debit Visa" },
      { id: "mastercard-debit", name: "Mastercard Debit", shortName: "MC DC", details: "Masukkan detail kartu debit Mastercard" },
    ],
    ewallet: [
      { id: "dana", name: "Dana", shortName: "Dana", details: "Scan QR atau masukkan nomor Dana" },
      { id: "ovo", name: "OVO", shortName: "OVO", details: "Scan QR atau masukkan nomor OVO" },
      { id: "gopay", name: "GoPay", shortName: "GoPay", details: "Scan QR atau masukkan nomor GoPay" },
      { id: "shopeepay", name: "ShopeePay", shortName: "ShopeePay", details: "Scan QR atau masukkan nomor ShopeePay" },
    ],
  };

  const handleSelectChannel = (channelId: string) => {
    setSelectedChannel(channelId);
  };

  const handlePreview = () => {
    if (selectedChannel) {
      const selectedChannelDetails = [...paymentChannels.banks, ...paymentChannels.cards, ...paymentChannels.ewallet].find(c => c.id === selectedChannel);
      navigate("/confirm-payment", {
        state: {
          selectedChannel: selectedChannelDetails,
          paymentDetails: currentPaymentDetails
        }
      });
    } else {
      alert("Pilih channel pembayaran terlebih dahulu");
    }
  };

  const selectedChannelDetails = selectedChannel ? 
    [...paymentChannels.banks, ...paymentChannels.cards, ...paymentChannels.ewallet].find(c => c.id === selectedChannel) : null;

  return (
    <SimpleLayout title="Pilih Channel Pembayaran">
      <div className="space-y-6">
        {/* Bank Transfer */}
        <div className="bg-blue-50/80 dark:bg-blue-900/30 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-blue-200/50 dark:border-blue-800/50">
          <div className="flex items-center gap-3 mb-4">
            <BuildingLibraryIcon className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Transfer Bank</h3>
          </div>
          <div className="space-y-3">
            {paymentChannels.banks.map((bank) => (
              <div key={bank.id} className="flex items-center justify-between p-3 rounded-xl bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border border-blue-200/60 dark:border-blue-700/60">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getPaymentIcon(bank.id)}</span>
                  <span className="font-medium text-blue-900 dark:text-blue-100">{bank.shortName}</span>
                </div>
                <button
                  onClick={() => handleSelectChannel(bank.id)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors backdrop-blur-sm ${
                    selectedChannel === bank.id
                      ? "border-blue-500 bg-blue-500/80 text-white"
                      : "border-blue-300/80 dark:border-blue-600/80 bg-white/50 dark:bg-gray-700/50"
                  }`}
                >
                  {selectedChannel === bank.id && <CheckCircleIcon className="w-5 h-5" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Credit/Debit Cards */}
        <div className="bg-purple-50/80 dark:bg-purple-900/30 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-purple-200/50 dark:border-purple-800/50">
          <div className="flex items-center gap-3 mb-4">
            <CreditCardIcon className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">Kartu Kredit/Debit</h3>
          </div>
          <div className="space-y-3">
            {paymentChannels.cards.map((card) => (
              <div key={card.id} className="flex items-center justify-between p-3 rounded-xl bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border border-purple-200/60 dark:border-purple-700/60">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getPaymentIcon(card.id)}</span>
                  <span className="font-medium text-purple-900 dark:text-purple-100">{card.shortName}</span>
                </div>
                <button
                  onClick={() => handleSelectChannel(card.id)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors backdrop-blur-sm ${
                    selectedChannel === card.id
                      ? "border-purple-500 bg-purple-500/80 text-white"
                      : "border-purple-300/80 dark:border-purple-600/80 bg-white/50 dark:bg-gray-700/50"
                  }`}
                >
                  {selectedChannel === card.id && <CheckCircleIcon className="w-5 h-5" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* E-Wallet */}
        <div className="bg-green-50/80 dark:bg-green-900/30 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-green-200/50 dark:border-green-800/50">
          <div className="flex items-center gap-3 mb-4">
            <WalletIcon className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">E-Wallet</h3>
          </div>
          <div className="space-y-3">
            {paymentChannels.ewallet.map((wallet) => (
              <div key={wallet.id} className="flex items-center justify-between p-3 rounded-xl bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border border-green-200/60 dark:border-green-700/60">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getPaymentIcon(wallet.id)}</span>
                  <span className="font-medium text-green-900 dark:text-green-100">{wallet.shortName}</span>
                </div>
                <button
                  onClick={() => handleSelectChannel(wallet.id)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors backdrop-blur-sm ${
                    selectedChannel === wallet.id
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-green-300/80 dark:border-green-600/80 bg-white/50 dark:bg-gray-700/50"
                  }`}
                >
                  {selectedChannel === wallet.id && <CheckCircleIcon className="w-5 h-5" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Channel Details */}
        {selectedChannelDetails && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Detail {selectedChannelDetails.name}</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">{selectedChannelDetails.details}</p>
          </div>
        )}

        {/* Preview Button */}
        <button
          onClick={handlePreview}
          className="w-full bg-orange-500 text-white py-4 px-6 rounded-3xl font-semibold text-lg hover:bg-orange-600 transition-colors shadow-lg"
        >
          Preview Pembayaran
        </button>
      </div>
    </SimpleLayout>
  );
}