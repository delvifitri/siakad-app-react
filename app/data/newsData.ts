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
};
