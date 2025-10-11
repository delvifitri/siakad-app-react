import { useParams, useNavigate } from "react-router-dom";
import SimpleLayout from "../layouts/SimpleLayout";
import { paymentList, paymentDetails } from "../data/paymentData";

export function meta() {
  return [{ title: "Detail Semester - Pembayaran" }];
}

export default function SemesterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // reconstruct semester string from slug
  const semesterKey = id ? decodeURIComponent(id).replace(/-/g, ' ') : '';

  const payments = paymentList.filter(p => p.semester.toLowerCase().includes(semesterKey.toLowerCase()));

  if (!payments.length) {
    return (
      <SimpleLayout title="Detail Semester">
        <div className="p-4 text-center">
          <p>Tidak ada data untuk semester ini.</p>
        </div>
      </SimpleLayout>
    );
  }

  const combinedBreakdown = payments.flatMap(p => (paymentDetails[p.id]?.breakdown ?? []));
  const total = payments.reduce((s, p) => s + p.amount, 0);

  // derive semester label (Semester 1, Semester 2, ...) from paymentList order
  const semesters = Array.from(new Set(paymentList.map(p => p.semester)));
  const semesterIndex = semesters.findIndex(s => s.toLowerCase().includes(semesterKey.toLowerCase()));
  const semesterLabel = semesterIndex >= 0 ? `Semester ${semesterIndex + 1}` : payments[0].semester;

  return (
    <SimpleLayout title="Detail Semester">
      <div className="space-y-6 p-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold">{semesterLabel}</h2>
              <p className="text-sm font-bold text-gray-900">Jumlah tagihan: Rp {total.toLocaleString()}</p>
            </div>
            <button onClick={() => navigate(-1)} className="text-sm text-gray-600">Kembali</button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-medium mb-3">Rincian</h3>
          <div className="space-y-3">
            {combinedBreakdown.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="text-gray-700">{item.item}</span>
                <span className="font-medium">Rp {item.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <hr className="my-4" />
          <div className="flex justify-between items-center font-bold">
            <span>Total</span>
            <span>Rp {total.toLocaleString()}</span>
          </div>
        </div>

      </div>
    </SimpleLayout>
  );
}
