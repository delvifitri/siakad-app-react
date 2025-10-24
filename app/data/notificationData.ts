export type NotificationItem = {
  id: string;
  title: string;
  description: string;
  course?: string;
  time?: string;
  instructor?: string;
  className?: string;
  type?: 'presensi' | 'info' | 'payment' | 'other';
  // Demo flag: when true, this presensi is considered closed/late
  closed?: boolean;
};

export const notifications: NotificationItem[] = [
  {
    id: 'presensi-1',
    type: 'presensi',
    title: 'Presensi Hari Ini',
    description: 'Silakan melakukan presensi untuk mata kuliah Anda hari ini.',
    course: 'Pemrograman Web',
    className: 'Kelas A',
    time: '09:00 - 10:30',
    instructor: 'Dr. Ananda Satful',
    closed: true, // contoh kasus terlambat (hanya satu)
  },
  {
    id: 'presensi-2',
    type: 'presensi',
    title: 'Presensi Hari Ini',
    description: 'Silakan melakukan presensi untuk mata kuliah Anda hari ini.',
    course: 'Sistem Operasi',
    className: 'Kelas A',
    time: '07:30 - 08:45',
    instructor: 'Dr. Ananda Satful',
  },
  {
    id: 'presensi-3',
    type: 'presensi',
    title: 'Presensi Hari Ini',
    description: 'Silakan melakukan presensi untuk mata kuliah Anda hari ini.',
    course: 'Jaringan Komputer',
    className: 'Kelas A',
    time: '08:45 - 09:00',
    instructor: 'Dr. Ananda Satful',
  },
  {
    id: 'presensi-4',
    type: 'presensi',
    title: 'Presensi Hari Ini',
    description: 'Silakan melakukan presensi untuk mata kuliah Anda hari ini.',
    course: 'Analisis Algoritma',
    className: 'Kelas A',
    time: '10:45 - 12:15',
    instructor: 'Dr. Ananda Satful',
  },
  {
    id: 'notif-2',
    type: 'info',
    title: 'Pengumuman Sistem',
    description: 'Sistem akan menjalankan maintenance pada pukul 02:00.',
  },
  {
    id: 'notif-3',
    type: 'info',
    title: 'Jadwal Kuliah',
    description: 'Perubahan jadwal untuk Mata Kuliah Pemrograman Web.',
  },
  {
    id: 'notif-4',
    type: 'payment',
    title: 'Pembayaran',
    description: 'Pembayaran Anda diterima pada 10 Oktober 2025.',
  },
];

export default notifications;
