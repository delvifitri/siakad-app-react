import MobileLayout from "../layouts/MobileLayout";

export function meta() {
  return [{ title: "Profil - Siakad" }];
}

export default function Profile() {
  return (
    <MobileLayout title="Profil">
      <div className="p-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Profil</h1>
        <p className="mt-4 text-gray-700 dark:text-gray-300">Halaman dummy profil pengguna.</p>
      </div>
    </MobileLayout>
  );
}
