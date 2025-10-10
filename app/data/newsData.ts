export type NewsItem = {
  title: string;
  date: string;
  img: string;
  content: string;
};

export const newsData: Record<number, NewsItem> = {
  1: {
    title: "Pengumuman Sistem Maintenance",
    date: "10 Oktober 2025",
    img: "/favicon.ico",
    content:
      "Sistem SIAKAD akan menjalankan maintenance pada pukul 02:00 hingga 04:00 WIB. Selama maintenance, sistem tidak dapat diakses. Mohon maaf atas ketidaknyamanannya.",
  },
  2: {
    title: "Jadwal Kuliah Diperbarui",
    date: "9 Oktober 2025",
    img: "/favicon.ico",
    content:
      "Perubahan jadwal kuliah untuk Mata Kuliah Pemrograman Web. Jadwal baru: Senin, 08:00 - 10:00 di Ruang 101. Silakan periksa jadwal terbaru di portal.",
  },
};
