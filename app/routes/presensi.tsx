import MobileLayout from "../layouts/MobileLayout";

export function meta() {
  return [{ title: "Presensi - Siakad" }];
}

export default function Presensi() {
  return (
    <MobileLayout title="Presensi">
      <div className="p-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Presensi</h1>
        <p className="mt-4 text-gray-700 dark:text-gray-300">Halaman dummy untuk fitur Presensi.</p>
      </div>
    </MobileLayout>
  );
}
