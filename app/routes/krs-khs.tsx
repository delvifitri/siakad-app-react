import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useKrsContext } from "../context/KrsContext";
import MobileLayout from "../layouts/MobileLayout";

export function meta() {
  return [{ title: "KRS/KHS - Siakad" }];
}

type Course = {
  id: string;
  name: string;
  lecturer: string; // default lecturer (legacy, will be overridden by selected class)
  className: string; // legacy default like "Kelas: A"
  note?: string;
  time: string; // default time (legacy, will be overridden by selected class)
  classes: Record<"A" | "B", { lecturer: string; additionalLecturers?: string[]; day: string; additionalDays?: string[]; time: string; additionalTimes?: string[]; remaining: number }>; // per-class data with quota, optional multiple lecturers and time/day variants
  sks: number;
  status: "added" | "available";
};

type OtherCourse = {
  id: string;
  name: string;
  classes: Record<"A" | "B", { lecturer: string; additionalLecturers?: string[]; day: string; additionalDays?: string[]; time: string; additionalTimes?: string[]; remaining: number }>;
  sks: number;
  originSemester: number;
  season: "Ganjil" | "Genap";
  isElective: boolean;
};

const currentSemester = 6;
const academicYear = "2024/2025";
const season = "Genap";

const krsCourses: Course[] = [
  {
    id: "if-web",
    name: "Pemrograman Web",
    lecturer: "Dr. Ahmad Satful",
    className: "Kelas: A",
    time: "09:00–10:30",
    classes: {
  A: { lecturer: "Dr. Ahmad Satful", additionalLecturers: ["Ir. Dewa Mahendra, M.Kom", "Dr. Lia Rahmat"], day: "Senin", additionalDays: ["Selasa", "Kamis"], time: "09:00–10:30", additionalTimes: ["10:45–12:15"], remaining: 5 },
  B: { lecturer: "Dr. Rina Putri", additionalLecturers: ["Ir. Dewa Mahendra, M.Kom"], day: "Rabu", additionalDays: ["Jumat"], time: "13:00–14:30", additionalTimes: ["15:00–16:30"], remaining: 6 },
    },
    sks: 3,
    status: "added",
  },
  {
    id: "if-db",
    name: "Basis Data",
    lecturer: "Dr. Setri Rahmawati",
    className: "Kelas: B (Tersisa 20)",
    time: "10:00–11:30",
    classes: {
  A: { lecturer: "Dr. Andi Saputra", additionalLecturers: ["Dr. Rudi Hartono"], day: "Selasa", additionalDays: ["Rabu"], time: "08:00–09:30", additionalTimes: ["09:45–11:15"], remaining: 10 },
  B: { lecturer: "Dr. Setri Rahmawati", additionalLecturers: ["Dr. Rudi Hartono"], day: "Kamis", additionalDays: ["Selasa"], time: "10:00–11:30", additionalTimes: ["13:00–14:30"], remaining: 20 },
    },
    sks: 2,
    status: "available",
  },
  {
    id: "if-net",
    name: "Jaringan Komputer",
    lecturer: "Dr. Bukit Santoso",
    className: "Kelas: A",
    time: "08:00–09:30",
    classes: {
  A: { lecturer: "Dr. Bukit Santoso", additionalLecturers: ["Ir. Sari Wulandari"], day: "Jumat", additionalDays: ["Kamis"], time: "08:00–09:30", additionalTimes: ["09:45–11:15"], remaining: 5 },
  B: { lecturer: "Ir. Sari Wulandari", additionalLecturers: ["Dr. Bukit Santoso"], day: "Rabu", additionalDays: ["Senin"], time: "14:00–15:30", additionalTimes: ["16:00–17:30"], remaining: 0 },
    },
    sks: 3,
    status: "available",
  },
];

// Courses from other semesters that can be taken (filtered by same season/genap-ganjil)
const otherSemesterCourses: OtherCourse[] = [
  {
    id: "if-sd",
    name: "Struktur Data",
    classes: {
  A: { lecturer: "Dr. Naufal Akbar", additionalLecturers: ["Dr. Tania Dewi"], day: "Senin", additionalDays: ["Rabu"], time: "07:30–09:00", additionalTimes: ["09:15–10:45"], remaining: 12 },
  B: { lecturer: "Dr. Naufal Akbar", additionalLecturers: ["Dr. Tania Dewi"], day: "Kamis", additionalDays: ["Selasa"], time: "10:00–11:30", additionalTimes: ["12:30–14:00"], remaining: 5 },
    },
    sks: 3,
    originSemester: 4,
    season: "Genap",
    isElective: false,
  },
  {
    id: "if-dm",
    name: "Data Mining",
    classes: {
  A: { lecturer: "Dr. Raden Bagas", additionalLecturers: ["Dr. Winda Kurnia"], day: "Selasa", additionalDays: ["Kamis"], time: "13:00–14:30", additionalTimes: ["08:00–09:30"], remaining: 8 },
  B: { lecturer: "Dr. Raden Bagas", additionalLecturers: ["Dr. Winda Kurnia"], day: "Jumat", additionalDays: ["Rabu"], time: "15:00–16:30", additionalTimes: ["10:15–11:45"], remaining: 0 },
    },
    sks: 3,
    originSemester: 4,
    season: "Genap",
    isElective: true,
  },
  {
    id: "if-md",
    name: "Matematika Diskrit",
    classes: {
  A: { lecturer: "Dr. Tania Dewi", additionalLecturers: ["Dr. Naufal Akbar"], day: "Rabu", additionalDays: ["Senin"], time: "08:00–09:30", additionalTimes: ["13:00–14:30"], remaining: 20 },
  B: { lecturer: "Dr. Tania Dewi", additionalLecturers: ["Dr. Naufal Akbar"], day: "Senin", additionalDays: ["Kamis"], time: "09:45–11:15", additionalTimes: ["07:30–09:00"], remaining: 18 },
    },
    sks: 2,
    originSemester: 2,
    season: "Genap",
    isElective: false,
  },
];

// --- KHS (Transcript) mock data and helpers ---
type LetterGrade = "A" | "B" | "C" | "D" | "E";
type KhsCourse = {
  code: string;
  name: string;
  sks: number;
  grade: LetterGrade;
};
type KhsSemester = {
  academicYear: string;
  studentName: string;
  nim: string;
  advisor: string;
  program: string;
  courses: KhsCourse[];
};

const gradePoint = (g: LetterGrade): number => ({ A: 4, B: 3, C: 2, D: 1, E: 0 }[g]);

const khsData: Record<number, KhsSemester> = {
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

export default function KrsKhs() {
  const { submitKrs } = useKrsContext();
  const [sp] = useSearchParams();
  const initialTab = (sp.get("tab") as "krs" | "khs") || "krs";
  const [tab, setTab] = useState<"krs" | "khs">(initialTab);
  const [krsFilter, setKrsFilter] = useState<"active" | "other">("active");
  const khsRef = useRef<HTMLDivElement>(null);
  // Map of courseId -> selected class (A/B). Initialize from legacy className when available.
  const [selectedClasses, setSelectedClasses] = useState<Record<string, "A" | "B">>(() => {
    const initial: Record<string, "A" | "B"> = {};
    for (const c of krsCourses) {
      const match = c.className.match(/Kelas:\s*([A-Z])/i);
      const cls = (match?.[1] as "A" | "B") ?? "A";
      initial[c.id] = cls;
    }
    return initial;
  });
  // Map of courseId -> isSelected (controls 'Sudah' vs 'Tambah KRS')
  const [selectedMap, setSelectedMap] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const c of krsCourses) initial[c.id] = c.status === "added";
    return initial;
  });

  // Submit flow (state only, no localStorage)
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitErrors, setSubmitErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [khsSemester, setKhsSemester] = useState<number>(currentSemester - 1);
  // Track selected time variant per course id (defaults to primary time)
  const [selectedTimes, setSelectedTimes] = useState<Record<string, string>>({});
  // Track selected day variant per course id (defaults to primary day)
  const [selectedDays, setSelectedDays] = useState<Record<string, string>>({});
  // Track selected schedule (day|time) per course id for a single dropdown UX
  const [selectedSchedules, setSelectedSchedules] = useState<Record<string, string>>({});
  // Track selected lecturer per course id
  const [selectedLecturers, setSelectedLecturers] = useState<Record<string, string>>({});

  const selectedCoursesMemo = useMemo(
    () => {
      const active = krsCourses
        .filter((c) => selectedMap[c.id])
        .map((c) => ({ id: c.id, name: c.name, sks: c.sks, classes: c.classes }));
      const other = otherSemesterCourses
        .filter((oc) => selectedMap[oc.id])
        .map((oc) => ({ id: oc.id, name: oc.name, sks: oc.sks, classes: oc.classes }));
      return [...active, ...other];
    },
    [selectedMap]
  );
  const totalSksMemo = useMemo(() => selectedCoursesMemo.reduce((sum, c) => sum + c.sks, 0), [selectedCoursesMemo]);

  function parseRangeToMinutes(range: string): [number, number] | null {
    const parts = range.split(/[–-]/);
    if (parts.length !== 2) return null;
    const [sH, sM] = parts[0].trim().split(":").map(Number);
    const [eH, eM] = parts[1].trim().split(":").map(Number);
    if ([sH, sM, eH, eM].some((n) => Number.isNaN(n))) return null;
    return [sH * 60 + sM, eH * 60 + eM];
  }

  function checkConflicts(): string[] {
    const errs: string[] = [];
    if (selectedCoursesMemo.length === 0) {
      errs.push("Pilih minimal 1 mata kuliah.");
    }
    // Quota check and time slots
    const slots: Array<{ name: string; cls: string; day: string; start: number; end: number }> = [];
    for (const c of selectedCoursesMemo) {
  const cls = selectedClasses[c.id] ?? "A";
  const d = c.classes[cls];
      const timeToUse = selectedTimes[c.id] || d.time;
      const dayToUse = selectedDays[c.id] || (d as any).day || "";
      if (d.remaining === 0) errs.push(`${c.name} (${cls}) kuota habis.`);
  const minutes = parseRangeToMinutes(timeToUse);
      if (!minutes) continue;
      const [start, end] = minutes;
      slots.push({ name: c.name, cls, day: dayToUse, start, end });
    }
    for (let i = 0; i < slots.length; i++) {
      for (let j = i + 1; j < slots.length; j++) {
        const a = slots[i];
        const b = slots[j];
        const sameDay = a.day && b.day && a.day === b.day;
        const overlap = sameDay && Math.max(a.start, b.start) < Math.min(a.end, b.end);
        if (overlap) errs.push(`Bentrok jadwal (${a.day}): ${a.name} (${a.cls}) dan ${b.name} (${b.cls}).`);
      }
    }
    // SKS range check (optional example 12-24)
    const totalSks = totalSksMemo;
    if (totalSks < 12) errs.push("Total SKS kurang dari minimum (12).");
    if (totalSks > 24) errs.push("Total SKS melebihi maksimum (24).");
    return errs;
  }

  function onSubmitClick() {
    if (submitted) return;
    const errs = checkConflicts();
    setSubmitErrors(errs);
    if (errs.length === 0) setShowConfirm(true);
  }

  function confirmSubmit() {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setShowConfirm(false);
      const items = selectedCoursesMemo.map((c) => ({
        id: c.id,
        name: c.name,
        sks: c.sks,
        cls: selectedClasses[c.id] ?? "A",
      }));
      submitKrs({ items, advisor: "Dr. Rina Putri" });
    }, 700);
  }

  async function handleDownloadPdf() {
    // Use browser's print dialog to export to PDF. Print CSS ensures only the KHS section is included.
    if (!khsRef.current) return;
    window.print();
  }

  return (
    <MobileLayout title="KRS / KHS" bgImage="/bg simple.png">
      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">KRS/KHS</h1>
        </div>

        {/* Tabs: Isi KRS | Lihat KHS */}
        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/20 rounded-full p-1 w-fit">
          <button onClick={() => setTab("krs")} className={`px-4 py-1.5 text-sm rounded-full transition ${tab === "krs" ? "bg-blue-600 text-white" : "text-gray-700"}`}>Isi KRS</button>
          <button onClick={() => setTab("khs")} className={`px-4 py-1.5 text-sm rounded-full transition ${tab === "khs" ? "bg-blue-600 text-white" : "text-gray-700"}`}>Lihat KHS</button>
        </div>

        {tab === "krs" ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Semester {currentSemester} – {academicYear} {season}</p>
            {/* Badge filters for KRS content */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setKrsFilter("active")}
                className={`px-3 py-1.5 text-xs rounded-full border transition ${krsFilter === "active"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 border-gray-200"
                  }`}
              >
                Semester Aktif
              </button>
              <button
                onClick={() => setKrsFilter("other")}
                className={`px-3 py-1.5 text-xs rounded-full border transition ${krsFilter === "other"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 border-gray-200"
                  }`}
              >
                Semester Lainnya
              </button>
            </div>

            {/* KRS list according to filter */}
            {krsFilter === "active" && krsCourses.map((c) => {
              const selected = selectedClasses[c.id] ?? "A";
              const selectedData = c.classes[selected];
              const timeOptions = [selectedData.time, ...(selectedData.additionalTimes || [])];
              const timeValue = selectedTimes[c.id] || selectedData.time;
              const isSelected = selectedMap[c.id] ?? false;
              return (
                <div key={c.id} className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-gray-900">{c.name}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-2 relative">
                        <span>{selectedLecturers[c.id] || selectedData.lecturer}</span>
                        {selectedData.additionalLecturers && selectedData.additionalLecturers.length > 0 && (
                          <LecturersBadge
                            lecturers={[selectedData.lecturer, ...selectedData.additionalLecturers]}
                            onSelect={(name, index) => {
                              if (submitted) return;
                              setSelectedLecturers((prev) => ({ ...prev, [c.id]: name }));
                              // pick schedule by aligning index to options length
                              const dayOptions = [selectedData.day, ...(selectedData.additionalDays || [])];
                              const timeOptionsLocal = [selectedData.time, ...(selectedData.additionalTimes || [])];
                              const daySel = dayOptions[index % dayOptions.length];
                              const timeSel = timeOptionsLocal[index % timeOptionsLocal.length];
                              setSelectedDays((prev) => ({ ...prev, [c.id]: daySel }));
                              setSelectedTimes((prev) => ({ ...prev, [c.id]: timeSel }));
                              setSelectedSchedules((prev) => ({ ...prev, [c.id]: `${daySel}|${timeSel}` }));
                            }}
                          />
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        {(() => {
                          const dayOptions = [selectedData.day, ...(selectedData.additionalDays || [])];
                          const combined = dayOptions.flatMap((d) => timeOptions.map((t) => ({
                            v: `${d}|${t}`,
                            label: `${d}, ${t}`,
                          })));
                          const currentVal = selectedSchedules[c.id] || `${selectedDays[c.id] || selectedData.day}|${timeValue}`;
                          return (
                            <select
                              className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-[11px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-300"
                              value={currentVal}
                              onChange={(e) => {
                                if (submitted) return;
                                const [dSel, tSel] = e.target.value.split('|');
                                setSelectedSchedules((prev) => ({ ...prev, [c.id]: e.target.value }));
                                setSelectedDays((prev) => ({ ...prev, [c.id]: dSel }));
                                setSelectedTimes((prev) => ({ ...prev, [c.id]: tSel }));
                              }}
                              disabled={submitted}
                            >
                              {combined.map((opt) => (
                                <option key={opt.v} value={opt.v}>{opt.label}</option>
                              ))}
                            </select>
                          );
                        })()}
                      </div>
                      <div className={`text-xs mt-1 ${selectedData.remaining === 0 ? "text-red-600 font-medium" : "text-gray-600"}`}>
                        {selectedData.remaining === 0 ? "Kuota habis" : `Sisa kuota: ${selectedData.remaining}`}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <select
                        className="text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-60"
                        value={selected}
                        onChange={(e) => {
                          if (submitted) return;
                          setSelectedClasses((prev) => ({ ...prev, [c.id]: (e.target.value as "A" | "B") }));
                        }}
                        disabled={submitted}
                      >
                        <option value="A">Kelas A</option>
                        <option value="B">Kelas B</option>
                      </select>
                      <div className="text-xs text-gray-600">{c.sks} SKS</div>
                      <label className="inline-flex items-center gap-2 text-xs text-gray-700">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-400 disabled:opacity-60"
                          checked={isSelected}
                          onChange={() => {
                            if (submitted) return;
                            setSelectedMap((prev) => ({ ...prev, [c.id]: !isSelected }));
                          }}
                          disabled={submitted || selectedData.remaining === 0}
                        />
                        <span className="select-none">{isSelected ? 'Dipilih' : (selectedData.remaining === 0 ? 'Kuota Habis' : 'Pilih')}</span>
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}

            {krsFilter === "other" && otherSemesterCourses
              .filter((oc) => oc.season === season && oc.originSemester !== currentSemester)
              .map((oc) => {
                const selected = selectedClasses[oc.id] ?? "A";
                const d = oc.classes[selected];
                const timeOptions = [d.time, ...(d.additionalTimes || [])];
                const timeValue = selectedTimes[oc.id] || d.time;
                const isSelected = selectedMap[oc.id] ?? false;
                return (
                  <div key={oc.id} className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-gray-900">{oc.name}</div>
                        <div className="text-xs text-gray-500 mt-1">Semester {oc.originSemester} – {oc.season} {oc.isElective ? "• Pilihan" : "• Wajib"}</div>
                        <div className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                          <span>{selectedLecturers[oc.id] || d.lecturer}</span>
                          {d.additionalLecturers && d.additionalLecturers.length > 0 && (
                            <LecturersBadge
                              lecturers={[d.lecturer, ...d.additionalLecturers]}
                              onSelect={(name, index) => {
                                if (submitted) return;
                                setSelectedLecturers((prev) => ({ ...prev, [oc.id]: name }));
                                const dayOptions = [d.day, ...(d.additionalDays || [])];
                                const timeOptionsLocal = [d.time, ...(d.additionalTimes || [])];
                                const daySel = dayOptions[index % dayOptions.length];
                                const timeSel = timeOptionsLocal[index % timeOptionsLocal.length];
                                setSelectedDays((prev) => ({ ...prev, [oc.id]: daySel }));
                                setSelectedTimes((prev) => ({ ...prev, [oc.id]: timeSel }));
                                setSelectedSchedules((prev) => ({ ...prev, [oc.id]: `${daySel}|${timeSel}` }));
                              }}
                            />
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                          {(() => {
                            const dayOptions = [d.day, ...(d.additionalDays || [])];
                            const combined = dayOptions.flatMap((dd) => timeOptions.map((t) => ({
                              v: `${dd}|${t}`,
                              label: `${dd}, ${t}`,
                            })));
                            const currentVal = selectedSchedules[oc.id] || `${selectedDays[oc.id] || d.day}|${timeValue}`;
                            return (
                              <select
                                className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-[11px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-300"
                                value={currentVal}
                                onChange={(e) => {
                                  if (submitted) return;
                                  const [dSel, tSel] = e.target.value.split('|');
                                  setSelectedSchedules((prev) => ({ ...prev, [oc.id]: e.target.value }));
                                  setSelectedDays((prev) => ({ ...prev, [oc.id]: dSel }));
                                  setSelectedTimes((prev) => ({ ...prev, [oc.id]: tSel }));
                                }}
                                disabled={submitted}
                              >
                                {combined.map((opt) => (
                                  <option key={opt.v} value={opt.v}>{opt.label}</option>
                                ))}
                              </select>
                            );
                          })()}
                        </div>
                        <div className={`text-xs mt-1 ${d.remaining === 0 ? "text-red-600 font-medium" : "text-gray-600"}`}>
                          {d.remaining === 0 ? "Kuota habis" : `Sisa kuota: ${d.remaining}`}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <select
                          className="text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
                          value={selected}
                          onChange={(e) => setSelectedClasses((prev) => ({ ...prev, [oc.id]: (e.target.value as "A" | "B") }))}
                          disabled={submitted}
                        >
                          <option value="A">Kelas A</option>
                          <option value="B">Kelas B</option>
                        </select>
                        <div className="text-xs text-gray-600">{oc.sks} SKS</div>
                        <label className="inline-flex items-center gap-2 text-xs text-gray-700">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-400 disabled:opacity-60"
                            checked={isSelected}
                            onChange={() => {
                              if (submitted) return;
                              setSelectedMap((prev) => ({ ...prev, [oc.id]: !isSelected }));
                            }}
                            disabled={submitted || d.remaining === 0}
                          />
                          <span className="select-none">{isSelected ? 'Dipilih' : (d.remaining === 0 ? 'Kuota Habis' : 'Pilih')}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          // KHS content matching provided screenshot style
          <div className="space-y-3 relative">
            {/* Download PDF button (top-right) */}
            <div className="flex justify-end">
              <button
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-orange-500 text-white hover:bg-orange-600 shadow"
                aria-label="Download KHS sebagai PDF"
              >
                {/* Download icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M3 14a1 1 0 011-1h2a1 1 0 010 2H5v1h10v-1h-1a1 1 0 110-2h2a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm6-11a1 1 0 012 0v7.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4A1 1 0 115.707 8.293L8 10.586V3z" clipRule="evenodd" />
                </svg>
                Download PDF
              </button>
            </div>
            {/* Semester selector */}
            <div className="flex items-center justify-between bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-3">
              <div className="text-sm font-medium text-gray-800">Pilih Semester KHS</div>
              <select
                className="text-sm px-2 py-1 rounded-lg bg-gray-100 text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
                value={khsSemester}
                onChange={(e) => setKhsSemester(Number(e.target.value))}
              >
                {Array.from({ length: currentSemester }, (_, i) => currentSemester - i).map((s) => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>

            {(() => {
              const data = khsData[khsSemester];
              // Fallback if no data: show an empty state card
              if (!data) {
                return (
                  <div className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm text-sm text-gray-700">
                    Data KHS untuk semester {khsSemester} belum tersedia.
                  </div>
                );
              }
              const totalSks = data.courses.reduce((sum, c) => sum + c.sks, 0);
              const totalNxS = data.courses.reduce((sum, c) => sum + gradePoint(c.grade) * c.sks, 0);
              const ip = totalSks > 0 ? (totalNxS / totalSks) : 0;

              // Cumulative IPK up to selected semester
              const semestersUpToSelected = Object.keys(khsData)
                .map((k) => Number(k))
                .filter((s) => s <= khsSemester)
                .sort((a, b) => a - b);
              let cumSks = 0;
              let cumNxS = 0;
              for (const s of semestersUpToSelected) {
                const sem = khsData[s];
                if (!sem) continue;
                cumSks += sem.courses.reduce((sum, c) => sum + c.sks, 0);
                cumNxS += sem.courses.reduce((sum, c) => sum + gradePoint(c.grade) * c.sks, 0);
              }
              const ipk = cumSks > 0 ? (cumNxS / cumSks) : 0;
              return (
                <div ref={khsRef} id="khs-print" className="space-y-3">
                  {/* Header info like the screenshot */}
                  <div className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm">
                    <div className="text-lg font-semibold text-gray-900">Kartu Hasil Studi</div>
                    <div className="text-xs text-gray-600">Semester {khsSemester} – Tahun Akademik {data.academicYear}</div>
                    <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Nama</span>
                        <span className="font-medium text-gray-900">{data.studentName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">NIM</span>
                        <span className="font-medium text-gray-900">{data.nim}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">PA</span>
                        <span className="font-medium text-gray-900">{data.advisor}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Prodi</span>
                        <span className="font-medium text-gray-900">{data.program}</span>
                      </div>
                    </div>
                  </div>

                  {/* Courses list */}
                  {data.courses.map((c) => {
                    const nilai = gradePoint(c.grade);
                    const nxs = nilai * c.sks;
                    return (
                      <div key={c.code} className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold text-gray-900">{c.name}</div>
                            <div className="text-xs text-gray-600 mt-1">Kode: {c.code}</div>
                            <div className="text-xs text-gray-600">SKS: {c.sks}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-600">Nilai: <span className="font-semibold text-gray-900">{c.grade}</span></div>
                            <div className="text-xs text-gray-600">Nilai × SKS: <span className="font-semibold text-gray-900">{nxs}</span></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Totals footer */}
                  <div className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm">
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-800">Total SKS <span className="font-semibold text-gray-900">{totalSks}</span></div>
                      <div className="text-gray-800">Total Nilai × SKS <span className="font-semibold text-gray-900">{totalNxS}</span></div>
                    </div>
                    <div className="mt-2 text-sm text-gray-800">IP Semester <span className="font-semibold text-gray-900">{ip.toFixed(2)}</span></div>
                    <div className="text-sm text-gray-800">IPK (Kumulatif) <span className="font-semibold text-gray-900">{ipk.toFixed(2)}</span></div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Selected courses summary (only show on KRS tab) */}
        {tab === "krs" && (() => {
          const selectedCourses = selectedCoursesMemo;
          const totalSks = totalSksMemo;
          return (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="font-semibold text-gray-900">Mata Kuliah Dipilih</div>
              <div className="mt-2 space-y-1 text-sm">
                {selectedCourses.length === 0 ? (
                  <div className="text-gray-500">Belum ada mata kuliah dipilih.</div>
                ) : (
                  selectedCourses.map((c) => (
                    <div key={c.id} className="flex items-center justify-between">
                      <span>
                        {c.name} ({selectedClasses[c.id] ?? "A"})
                      </span>
                      <span className="text-gray-600">{c.sks} SKS</span>
                    </div>
                  ))
                )}
              </div>
              <hr className="mt-2" />
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-gray-600">Mata Kuliah Dipilih: {selectedCourses.length}</span>
                <span className="text-gray-600">Total SKS: {totalSks}/24</span>
              </div>
            </div>
          );
        })()}

        {/* Validation errors (outside tabs) */}
        {submitErrors.length > 0 && (
          <div className="bg-red-50 text-red-700 text-sm rounded-xl p-3">
            <ul className="list-disc pl-5 space-y-1">
              {submitErrors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit CTA (only show on KRS tab) */}
        {tab === "krs" && (
          <div className="sticky bottom-4">
            <button
              onClick={onSubmitClick}
              disabled={submitted}
              className={`w-full py-3 rounded-full font-semibold shadow transition ${submitted
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-br from-orange-500 to-orange-400 text-white hover:from-orange-600 hover:to-orange-500"
                }`}
            >
              {submitted ? "Menunggu Persetujuan PA" : "Kirim KRS ke Dosen PA"}
            </button>
          </div>
        )}
      </div>
      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => (!isSubmitting ? setShowConfirm(false) : null)} />
          <div className="relative bg-white rounded-2xl w-full sm:max-w-md mx-4 p-4 shadow-lg">
            <div className="font-semibold text-gray-900">Konfirmasi Kirim KRS</div>
            <div className="mt-2 text-sm text-gray-700">Periksa ringkasan di bawah ini sebelum dikirim.</div>
            <div className="mt-3 max-h-60 overflow-auto divide-y">
              {selectedCoursesMemo.map((c) => (
                <div key={c.id} className="py-2 flex items-center justify-between text-sm">
                  <span>
                    {c.name} ({selectedClasses[c.id] ?? "A"})
                  </span>
                  <span className="text-gray-600">{c.sks} SKS</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-600">Mata Kuliah Dipilih: {selectedCoursesMemo.length}</span>
              <span className="text-gray-600">Total SKS: {totalSksMemo}/24</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                className="py-2 rounded-full border border-gray-300 text-gray-700"
                onClick={() => setShowConfirm(false)}
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                className={`py-2 rounded-full text-white ${isSubmitting ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"}`}
                onClick={confirmSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Mengirim..." : "Kirim"}
              </button>
            </div>
          </div>
        </div>
      )}
    </MobileLayout>
  );
}

// Print-only CSS to ensure only #khs-print is printed
// Using a style tag here keeps it local to this route component output
export function links() {
  const css = `
  @media print {
    body * { visibility: hidden !important; }
    #khs-print, #khs-print * { visibility: visible !important; }
    #khs-print { position: absolute; left: 0; top: 0; width: 100%; }
  }
  `;
  return [
    {
      rel: "stylesheet",
      href: `data:text/css,${encodeURIComponent(css)}`,
    },
  ];
}

// Small inline component to render a +N badge and a scrollable dropdown list of lecturers
function LecturersBadge({ lecturers, onSelect }: { lecturers: string[]; onSelect?: (name: string, index: number) => void }) {
  const [open, setOpen] = useState(false);
  const extra = Math.max(0, lecturers.length - 1);
  if (extra <= 0) return null;
  return (
    <span className="relative inline-block" onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        +{extra}
      </button>
      {open && (
        <div
          className="absolute z-50 left-full top-0 ml-2 w-56 max-h-48 overflow-y-auto overscroll-contain rounded-lg bg-white ring-1 ring-black/10 shadow-lg p-2 text-xs"
          role="listbox"
        >
          <div className="text-[11px] font-semibold text-gray-500 px-1 pb-1">Dosen Pengampu</div>
          {lecturers.map((name, idx) => (
            <button
              key={idx}
              type="button"
              className="w-full text-left px-2 py-1 rounded hover:bg-gray-50 text-gray-800"
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.(name, idx);
                setOpen(false);
              }}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </span>
  );
}
