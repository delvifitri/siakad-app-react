import MobileLayout from "../layouts/MobileLayout";

export function meta() {
  return [{ title: "KRS/KHS - Siakad" }];
}

export default function KrsKhs() {
  return (
    <MobileLayout title="KRS / KHS">
      <div className="p-4">
        <h1 className="text-2xl font-semibold text-gray-900 ">KRS / KHS</h1>
        <p className="mt-4 text-gray-700 ">Halaman dummy untuk KRS dan KHS.</p>
      </div>
    </MobileLayout>
  );
}
