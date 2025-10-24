export type NewsItem = {
  title: string;
  date: string;
  img: string;
  content: string;
};

export const newsData: Record<number, NewsItem> = {
  1: {
    title: "Pendaftaran Beasiswa Dibuka",
    date: "10 Oktober 2025",
    img: "/favicon.ico",
    content:
      "Pendaftaran beasiswa semester genap telah dibuka. Mahasiswa diharapkan menyiapkan berkas persyaratan sebelum tanggal tutup.",
  },
  2: {
    title: "Seminar Industri Minggu Ini",
    date: "9 Oktober 2025",
    img: "/favicon.ico",
    content:
      "Ikuti seminar bersama perusahaan mitra untuk insight karir dan peluang magang. Terbuka untuk seluruh mahasiswa.",
  },
  3: {
    title: "Rapat Dosen Mingguan: Agenda Kurikulum",
    date: "12 Oktober 2025",
    img: "/favicon.ico",
    content:
      "Undangan rapat dosen mingguan membahas sinkronisasi kurikulum dan penyesuaian RPS. Mohon kehadiran tepat waktu.",
  },
  4: {
    title: "Pembukaan Hibah Penelitian Internal 2025",
    date: "15 Oktober 2025",
    img: "/favicon.ico",
    content:
      "LPPM membuka pendaftaran hibah penelitian internal 2025. Dosen diharapkan mengajukan proposal sesuai panduan yang tersedia.",
  },
  5: {
    title: "Sosialisasi Kurikulum MBKM untuk Dosen",
    date: "18 Oktober 2025",
    img: "/favicon.ico",
    content:
      "Sosialisasi implementasi kurikulum MBKM untuk dosen pengampu mata kuliah. Materi meliputi penyetaraan SKS dan RPS.",
  },
  6: {
    title: "Workshop Penulisan Proposal Hibah",
    date: "20 Oktober 2025",
    img: "/favicon.ico",
    content:
      "Workshop intensif penulisan proposal hibah penelitian dan pengabdian untuk meningkatkan kualitas pengajuan dosen.",
  },
};
