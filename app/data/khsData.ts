// Shared KHS (Transcript) mock data and helpers for IP/PK calculations

export type LetterGrade = "A" | "B" | "C" | "D" | "E";

export type KhsCourse = {
  code: string;
  name: string;
  sks: number;
  grade: LetterGrade;
};

export type KhsSemester = {
  academicYear: string;
  studentName: string;
  nim: string;
  advisor: string;
  program: string;
  courses: KhsCourse[];
};

export const gradePoint = (g: LetterGrade): number => ({ A: 4, B: 3, C: 2, D: 1, E: 0 }[g]);

export const khsData: Record<number, KhsSemester> = {
  // Semester 1 – Informatika courses for Budi
  1: {
    academicYear: "2022/2023",
    studentName: "Budi",
    nim: "123456789",
    advisor: "Dr. Dedi Pratama",
    program: "Informatika S1",
    courses: [
      { code: "IF101", name: "Pengantar Informatika", sks: 2, grade: "B" },
      { code: "IF102", name: "Algoritma dan Pemrograman", sks: 4, grade: "B" },
      { code: "IF103", name: "Matematika Diskrit", sks: 3, grade: "B" },
    ],
  },
  // Semester 4 – Informatika
  4: {
    academicYear: "2023/2024",
    studentName: "Budi",
    nim: "123456789",
    advisor: "Dr. Andi Saputra",
    program: "Informatika S1",
    courses: [
      { code: "IF301", name: "Struktur Data Lanjut", sks: 3, grade: "A" },
      { code: "IF302", name: "Sistem Operasi", sks: 3, grade: "B" },
      { code: "IF303", name: "Jaringan Komputer", sks: 3, grade: "B" },
      { code: "IF304", name: "Pemrograman Berorientasi Objek", sks: 3, grade: "A" },
    ],
  },
  // Semester 5 – Informatika
  5: {
    academicYear: "2024/2025",
    studentName: "Budi",
    nim: "123456789",
    advisor: "Dr. Rina Putri",
    program: "Informatika S1",
    courses: [
      { code: "IF401", name: "Pemrograman Web", sks: 3, grade: "A" },
      { code: "IF402", name: "Basis Data", sks: 2, grade: "B" },
      { code: "IF403", name: "Kecerdasan Buatan", sks: 3, grade: "B" },
    ],
  },
};
