// Mock data for payment details - in real app this would come from API
export const paymentDetails = {
  "ukt-2025-1": {
    id: "ukt-2025-1",
    semester: "Ganjil 2025/2026",
    type: "UKT/SPP",
    amount: 3000000,
    dueDate: "15 November 2025",
    status: "Belum Dibayar",
    description: "Uang Kuliah Tunggal dan Sumbangan Pengembangan Pendidikan",
    breakdown: [
      { item: "UKT Pokok", amount: 2500000 },
      { item: "SPP", amount: 500000 }
    ]
  },
  "praktikum-2025-1": {
    id: "praktikum-2025-1",
    semester: "Ganjil 2025/2026",
    type: "Praktikum",
    amount: 200000,
    dueDate: "15 November 2025",
    status: "Belum Dibayar",
    description: "Biaya praktikum mata kuliah",
    breakdown: [
      { item: "Praktikum Kimia", amount: 80000 },
      { item: "Praktikum Fisika", amount: 60000 },
      { item: "Praktikum Biologi", amount: 60000 }
    ]
  },
  "ukt-2024-2": {
    id: "ukt-2024-2",
    semester: "Genap 2024/2025",
    type: "UKT/SPP",
    amount: 2800000,
    dueDate: "15 Mei 2025",
    status: "Lunas",
    description: "Uang Kuliah Tunggal dan Sumbangan Pengembangan Pendidikan",
    breakdown: [
      { item: "UKT Pokok", amount: 2300000 },
      { item: "SPP", amount: 500000 }
    ]
  }
};

// Payment list for main pembayaran page
export const paymentList = [
  {
    id: "ukt-2025-1",
    semester: "Ganjil 2025/2026",
    type: "UKT/SPP",
    amount: 3000000,
    dueDate: "15 November 2025",
    status: "Belum Dibayar",
    description: "Uang Kuliah Tunggal dan Sumbangan Pengembangan Pendidikan"
  },
  {
    id: "praktikum-2025-1",
    semester: "Ganjil 2025/2026",
    type: "Praktikum",
    amount: 200000,
    dueDate: "15 November 2025",
    status: "Belum Dibayar",
    description: "Biaya praktikum mata kuliah"
  },
  {
    id: "ukt-2024-2",
    semester: "Genap 2024/2025",
    type: "UKT/SPP",
    amount: 2800000,
    dueDate: "15 Mei 2025",
    status: "Lunas",
    description: "Uang Kuliah Tunggal dan Sumbangan Pengembangan Pendidikan"
  }
];

// Default payment details for confirm-payment page
export const defaultPaymentDetails = {
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

export type PaymentDetail = typeof paymentDetails[keyof typeof paymentDetails];