import SimpleLayout from "../layouts/SimpleLayout";
import { Link } from "react-router";

export default function Messages() {
  return (
    <SimpleLayout title="Pesan">
      <div className="space-y-4">
        <Link to="/chat/1" className="block p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">D</div>
            <div className="flex-1">
              <h2 className="font-medium">Dosen A</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">Halo, ada pertanyaan tentang tugas?</p>
            </div>
            <span className="text-xs text-gray-500">10:30</span>
          </div>
        </Link>

        <Link to="/chat/2" className="block p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">M</div>
            <div className="flex-1">
              <h2 className="font-medium">Mahasiswa B</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">Terima kasih atas bantuannya!</p>
            </div>
            <span className="text-xs text-gray-500">09:15</span>
          </div>
        </Link>

        <Link to="/chat/3" className="block p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">A</div>
            <div className="flex-1">
              <h2 className="font-medium">Admin</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">Pemberitahuan penting tentang jadwal.</p>
            </div>
            <span className="text-xs text-gray-500">Kemarin</span>
          </div>
        </Link>
      </div>
    </SimpleLayout>
  );
}