import { Link } from "react-router-dom";
import MobileLayout from "../layouts/MobileLayout";
import { PencilIcon, CogIcon, ArrowRightOnRectangleIcon, BellIcon, ShieldCheckIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

export function meta() {
  return [{ title: "Profil - Siakad" }];
}

export default function Profile() {
  return (
    <MobileLayout title="Profil" bgImage="/bg simple.png">
      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <img src="/profile.jpg" alt="profile" className="w-20 h-20 rounded-full object-cover" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Budi Santoso</h2>
              <p className="text-gray-600 dark:text-gray-400">Informatika (123456789)</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Semester 6</p>
            </div>
            <Link to="/edit-profile" className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" aria-label="Edit profil">
              <PencilIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Link>
          </div>
        </div>

        {/* Academic Info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Informasi Akademik</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">IPK</span>
              <span className="font-medium">3.75</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total SKS</span>
              <span className="font-medium">120</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Status KRS</span>
              <span className="font-medium text-green-600">Disetujui</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <Link to="/login" className="mt-12 w-full flex items-center justify-center gap-3 p-3 bg-red-600 text-white rounded-4xl hover:bg-red-700 transition-colors">
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          <span>Logout</span>
        </Link>
      </div>
    </MobileLayout>
  );
}
