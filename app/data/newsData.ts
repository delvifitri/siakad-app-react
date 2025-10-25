export type NewsItem = {
  title: string;
  date: string;
  img: string;
  content: string;
  role?: 'student' | 'dosen';
};

export const newsData: Record<number, NewsItem> = {
  1: {
    title: "Pendaftaran Beasiswa Dibuka",
    date: "10 Oktober 2025",
    img: "/favicon.ico",
    content:
      "Pendaftaran beasiswa semester genap telah dibuka. Mahasiswa diharapkan menyiapkan berkas persyaratan sebelum tanggal tutup.",
    role: 'student',
  },
  2: {
    title: "Seminar Industri Minggu Ini",
    date: "9 Oktober 2025",
    img: "/favicon.ico",
    content:
      "Ikuti seminar bersama perusahaan mitra untuk insight karir dan peluang magang. Terbuka untuk seluruh mahasiswa.",
    role: 'student',
  },
  3: {
    title: "Rapat Dosen Mingguan: Agenda Kurikulum",
    date: "12 Oktober 2025",
    img: "/favicon.ico",
    content:
      "Undangan rapat dosen mingguan membahas sinkronisasi kurikulum dan penyesuaian RPS. Mohon kehadiran tepat waktu.",
    role: 'dosen',
  },
  4: {
    title: "Pembukaan Hibah Penelitian Internal 2025",
    date: "15 Oktober 2025",
    img: "/favicon.ico",
    content:
      "LPPM membuka pendaftaran hibah penelitian internal 2025. Dosen diharapkan mengajukan proposal sesuai panduan yang tersedia.",
    role: 'dosen',
  },
  5: {
    title: "Sosialisasi Kurikulum MBKM untuk Dosen",
    date: "18 Oktober 2025",
    img: "/favicon.ico",
    content:
      "Sosialisasi implementasi kurikulum MBKM untuk dosen pengampu mata kuliah. Materi meliputi penyetaraan SKS dan RPS.",
    role: 'dosen',
  },
  6: {
    title: "Workshop Penulisan Proposal Hibah",
    date: "20 Oktober 2025",
    img: "/favicon.ico",
    content:
      "Workshop intensif penulisan proposal hibah penelitian dan pengabdian untuk meningkatkan kualitas pengajuan dosen.",
    role: 'dosen',
  },
  7: {
    title: "Lomba Inovasi Teknologi Kampus",
    date: "22 Oktober 2025",
    img: "/favicon.ico",
    content:
      "Ayo ikuti Lomba Inovasi Teknologi untuk mahasiswa. Kategori: aplikasi mobile, AI, dan IoT. Hadiah jutaan rupiah!",
    role: 'student',
  },
  8: {
    title: "Campus Career Fair 2025",
    date: "24 Oktober 2025",
    img: "/favicon.ico",
    content:
      "Career Fair menghadirkan lebih dari 30 perusahaan. Siapkan CV terbaikmu dan daftar melalui portal karir kampus.",
    role: 'student',
  },
  9: {
    title: "Call for Papers: Journal of Informatics",
    date: "21 Oktober 2025",
    img: "/favicon.ico",
    content:
      "Jurnal Informatika membuka call for papers edisi Desember 2025. Topik: Data Science, AI, Software Engineering.",
    role: 'dosen',
  },
  10: {
    title: "Persiapan Akreditasi Program Studi",
    date: "28 Oktober 2025",
    img: "/favicon.ico",
    content:
      "Tim prodi akan mengadakan workshop penyusunan LED dan LKPS. Dimohon partisipasi seluruh dosen pengampu.",
    role: 'dosen',
  },
};
