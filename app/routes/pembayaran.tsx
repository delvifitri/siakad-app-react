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

  // Group payments by semester
  const grouped = paymentList.reduce<Record<string, typeof paymentList>>((acc, p) => {
    if (!acc[p.semester]) acc[p.semester] = [];
    acc[p.semester].push(p);
    return acc;
  }, {});

  // Build display entries and append placeholder semesters if needed
  const groupedEntries = Object.entries(grouped);
  const displayEntries: Array<[string, typeof paymentList]> = [...groupedEntries];

  // Placeholder data for semester 3 and 4 (50% progress)
  const placeholders = [
    [
      "Ganjil 2020/2021",
      [
        { id: "ph-3-a", semester: "Ganjil 2020/2021", type: "UKT/SPP", amount: 2000000, dueDate: "15 Jan 2021", status: "Lunas", description: "UKT Pokok" },
        { id: "ph-3-b", semester: "Ganjil 2020/2021", type: "Praktikum", amount: 2000000, dueDate: "15 Jan 2021", status: "Belum Dibayar", description: "Biaya Praktikum" }
      ] as typeof paymentList
    ],
    [
      "Genap 2022/2023",
      [
        { id: "ph-4-a", semester: "Genap 2022/2023", type: "UKT/SPP", amount: 3000000, dueDate: "15 Mei 2023", status: "Lunas", description: "UKT Pokok" },
        { id: "ph-4-b", semester: "Genap 2022/2023", type: "Praktikum", amount: 3000000, dueDate: "15 Mei 2023", status: "Belum Dibayar", description: "Biaya Praktikum" }
      ] as typeof paymentList
    ]
  ];

  for (let i = displayEntries.length; i < 4; i++) {
    const ph = placeholders[i - displayEntries.length];
    if (ph) displayEntries.push(ph as [string, typeof paymentList]);
  }

  return (
    <MobileLayout title="Pembayaran" bgImage="/bg simple.png">
      <div className="p-4 space-y-2">
        <h1 className="text-2xl font-bold text-gray-900 ">Pembayaran Biaya Semester</h1>
  {displayEntries.map(([semester, payments], index) => {
          const unpaidCount = payments.filter((p) => p.status !== "Lunas").length;
          const totalAmount = payments.reduce((s, p) => s + p.amount, 0);
          // create a slug for route (safe)
          const slug = encodeURIComponent(semester.replace(/\s+/g, '-').toLowerCase());
          const semesterLabel = `Semester ${index + 1}`;

          // override academic year and season per semester index (1-based)
          const preset = [
            { year: '2019/2020', season: 'Ganjil' },
            { year: '2020/2021', season: 'Genap' },
            { year: '2022/2023', season: 'Ganjil' },
            { year: '2023/2024', season: 'Genap' }
          ];

          const info = preset[index] || null;
          const academicYear = info ? info.year : payments[0].semester.replace(/\b(Ganjil|Genap)\b/ig, '').trim();
          const season = info ? info.season : (payments[0].semester.match(/\b(Ganjil|Genap)\b/i) || [])[0] || '';

          return (
            <div key={semester} className="py-2">
              <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl shadow-sm p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-gray-800">{semesterLabel}</div>
                  <div className="text-sm font-bold text-gray-900">Rp {totalAmount.toLocaleString()}</div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span>{academicYear}</span>
                    {season && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">{season}</span>
                    )}
                  </div>
                  <div className="w-36 bg-gray-100 rounded-full h-2 overflow-hidden">
                    {(() => {
                      // compute percent paid
                      const lunasCount = payments.filter(p => p.status === 'Lunas').length;
                      let percent = Math.round((lunasCount / payments.length) * 100);
                      // Force Semester 1 to show 50% like placeholders
                      if (index === 0) percent = 50;
                      const barColor = percent === 100 ? 'bg-teal-400' : 'bg-orange-500';
                      return <div className={`h-2 ${barColor}`} style={{ width: `${percent}%` }} />;
                    })()}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {unpaidCount === 0 ? (
                      <span className="text-sm text-teal-600 font-medium">Lunas</span>
                    ) : (
                      <button onClick={() => navigate(`/pembayaran/semester/${slug}`)} className="text-sm text-orange-500 font-medium">Lihat Detail</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </MobileLayout>
  );
}
