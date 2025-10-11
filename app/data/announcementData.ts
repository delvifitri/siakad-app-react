export type Announcement = {
  id: number;
  title: string;
  description: string;
  date: string;
  img: string;
};

export const announcements: Announcement[] = [
  {
    id: 1,
    title: "Pengumuman Wisuda Campus 2025",
    description:
      "Universitas akan menyelenggarakan wisuda periode Oktober 2025 pada tanggal 25 Oktober 2025 di Aula Utama. Semua wisudawan diwajibkan hadir tepat waktu dan membawa dokumen yang diperlukan. Informasi lebih lanjut dapat dilihat di portal resmi.",
    date: "25 Oktober 2025",
    img: "/bg color.png",
  },
  {
    id: 2,
    title: "Perubahan Jadwal Kuliah",
    description:
      "Perubahan jadwal untuk Mata Kuliah Pemrograman Web. Jadwal baru: Senin, 08:00 - 10:00 WIB.",
    date: "9 Oktober 2025",
    img: "/bg simple.png",
  },
  {
    id: 3,
    title: "Pembayaran SPP",
    description:
      "Pembayaran SPP semester ini telah dibuka. Batas pembayaran hingga 15 Oktober 2025.",
    date: "8 Oktober 2025",
    img: "/bg white.png",
  },
];
