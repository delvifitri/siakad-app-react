import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MobileLayout from "../layouts/MobileLayout";
import { useKrsContext } from "../context/KrsContext";
import { khsData, gradePoint } from "../data/khsData";

export function meta() {
  return [{ title: "KRS/KHS - Siakad" }];
}

type ClassInfo = {
  lecturer: string;
  additionalLecturers?: string[];
  day: string;
  additionalDays?: string[];
  time: string;
  additionalTimes?: string[];
  remaining: number;
};

type Course = {
  id: string;
  name: string;
  lecturer: string;
  className: string;
  note?: string;
  time: string;
  classes: Record<"A" | "B", ClassInfo>;
  sks: number;
  status: "added" | "available";
};

type OtherCourse = {
  id: string;
  name: string;
  classes: Record<"A" | "B", ClassInfo>;
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
      A: {
        lecturer: "Dr. Ahmad Satful",
        additionalLecturers: ["Ir. Dewa Mahendra, M.Kom", "Dr. Lia Rahmat"],
        day: "Senin",
        additionalDays: ["Selasa", "Kamis"],
        time: "09:00–10:30",
        additionalTimes: ["10:45–12:15"],
        remaining: 5,
      },
      B: {
        lecturer: "Dr. Rina Putri",
        additionalLecturers: ["Ir. Dewa Mahendra, M.Kom"],
        day: "Rabu",
        additionalDays: ["Jumat"],
        time: "13:00–14:30",
        additionalTimes: ["15:00–16:30"],
        remaining: 6,
      },
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
      A: {
        lecturer: "Dr. Andi Saputra",
        additionalLecturers: ["Dr. Rudi Hartono"],
        day: "Selasa",
        additionalDays: ["Rabu"],
        time: "08:00–09:30",
        additionalTimes: ["09:45–11:15"],
        remaining: 10,
      },
      B: {
        lecturer: "Dr. Setri Rahmawati",
        additionalLecturers: ["Dr. Rudi Hartono"],
        day: "Kamis",
        additionalDays: ["Selasa"],
        time: "10:00–11:30",
        additionalTimes: ["13:00–14:30"],
        remaining: 20,
      },
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
      A: {
        lecturer: "Dr. Bukit Santoso",
        additionalLecturers: ["Ir. Sari Wulandari"],
        day: "Jumat",
        additionalDays: ["Kamis"],
        time: "08:00–09:30",
        additionalTimes: ["09:45–11:15"],
        remaining: 5,
      },
      B: {
        lecturer: "Ir. Sari Wulandari",
        additionalLecturers: ["Dr. Bukit Santoso"],
        day: "Rabu",
        additionalDays: ["Senin"],
        time: "14:00–15:30",
        additionalTimes: ["16:00–17:30"],
        remaining: 0,
      },
    },
    sks: 3,
    status: "available",
  },
];

const otherSemesterCourses: OtherCourse[] = [
  {
    id: "if-sd",
    name: "Struktur Data",
    classes: {
      A: {
        lecturer: "Dr. Naufal Akbar",
        additionalLecturers: ["Dr. Tania Dewi"],
        day: "Senin",
        additionalDays: ["Rabu"],
        time: "07:30–09:00",
        additionalTimes: ["09:15–10:45"],
        remaining: 12,
      },
      B: {
        lecturer: "Dr. Naufal Akbar",
        additionalLecturers: ["Dr. Tania Dewi"],
        day: "Kamis",
        additionalDays: ["Selasa"],
        time: "10:00–11:30",
        additionalTimes: ["12:30–14:00"],
        remaining: 5,
      },
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
      A: {
        lecturer: "Dr. Raden Bagas",
        additionalLecturers: ["Dr. Winda Kurnia"],
        day: "Selasa",
        additionalDays: ["Kamis"],
        time: "13:00–14:30",
        additionalTimes: ["08:00–09:30"],
        remaining: 8,
      },
      B: {
        lecturer: "Dr. Raden Bagas",
        additionalLecturers: ["Dr. Winda Kurnia"],
        day: "Jumat",
        additionalDays: ["Rabu"],
        time: "15:00–16:30",
        additionalTimes: ["10:15–11:45"],
        remaining: 0,
      },
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
      A: {
        lecturer: "Dr. Tania Dewi",
        additionalLecturers: ["Dr. Naufal Akbar"],
        day: "Rabu",
        additionalDays: ["Senin"],
        time: "08:00–09:30",
        additionalTimes: ["13:00–14:30"],
        remaining: 20,
      },
      B: {
        lecturer: "Dr. Tania Dewi",
        additionalLecturers: ["Dr. Naufal Akbar"],
        day: "Senin",
        additionalDays: ["Kamis"],
        time: "09:45–11:15",
        additionalTimes: ["07:30–09:00"],
        remaining: 18,
      },
    },
    sks: 2,
    originSemester: 2,
    season: "Genap",
    isElective: false,
  },
];

export default function KrsKhs() {
  const { submitKrs } = useKrsContext();
  const [sp, setSp] = useSearchParams();
  const initialTab = (sp.get("tab") as "krs" | "khs" | "ipk") || "krs";
  const [tab, setTab] = useState<"krs" | "khs" | "ipk">(initialTab);
  const [krsFilter, setKrsFilter] = useState<"active" | "other">("active");
  const khsRef = useRef<HTMLDivElement>(null);

  const [selectedClasses, setSelectedClasses] = useState<Record<string, "A" | "B">>(() => {
    const initial: Record<string, "A" | "B"> = {};
    for (const c of krsCourses) {
      const match = c.className.match(/Kelas:\s*([A-Z])/i);
      const cls = (match?.[1] as "A" | "B") ?? "A";
      initial[c.id] = cls;
    }
    return initial;
  });

  const [selectedMap, setSelectedMap] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const c of krsCourses) initial[c.id] = c.status === "added";
    return initial;
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [submitErrors, setSubmitErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [khsSemester, setKhsSemester] = useState<number>(currentSemester - 1);

  const [selectedTimes, setSelectedTimes] = useState<Record<string, string>>({});
  const [selectedDays, setSelectedDays] = useState<Record<string, string>>({});
  const [selectedLecturers, setSelectedLecturers] = useState<Record<string, string>>({});

  const [modal, setModal] = useState<{
    open: boolean;
    kind: "lecturers" | "schedule";
    courseId: string | null;
    options?: any;
  }>({ open: false, kind: "lecturers", courseId: null });

  // No draft needed; schedule modal lists combined day+time options like lecturers modal

  function openLecturers(courseId: string, lecturers: string[]) {
    setModal({ open: true, kind: "lecturers", courseId, options: { lecturers } });
  }
  function openSchedule(
    courseId: string,
    dayOptions: string[],
    timeOptions: string[],
    current: { day: string; time: string }
  ) {
    // Build combined options as Cartesian product of days x times
    const combos: Array<{ day: string; time: string }> = [];
    for (const day of dayOptions) {
      for (const time of timeOptions) {
        combos.push({ day, time });
      }
    }
    setModal({ open: true, kind: "schedule", courseId, options: { combos, current } });
  }
  function closeModal() {
    setModal((m) => ({ ...m, open: false }));
  }

  const ipsBySemester = useMemo(() => {
    const sems = Object.keys(khsData)
      .map(Number)
      .sort((a, b) => a - b);
    return sems.map((s) => {
      const data = khsData[s];
      const totalSks = data.courses.reduce((sum, c) => sum + c.sks, 0);
      const totalNxS = data.courses.reduce((sum, c) => sum + gradePoint(c.grade) * c.sks, 0);
      const ip = totalSks > 0 ? totalNxS / totalSks : 0;
      return { semester: s, academicYear: data.academicYear, ip, totalSks };
    });
  }, []);

  const ipkSummary = useMemo(() => {
    const cum = ipsBySemester.reduce(
      (acc, r) => ({ sks: acc.sks + r.totalSks, nxs: acc.nxs + r.ip * r.totalSks }),
      { sks: 0, nxs: 0 }
    );
    const ipk = cum.sks > 0 ? cum.nxs / cum.sks : 0;
    const lastIps = ipsBySemester.length > 0 ? ipsBySemester[ipsBySemester.length - 1].ip : 0;
    return { ipk, totalSks: cum.sks, lastIps };
  }, [ipsBySemester]);

  // Info tambahan untuk tab IPK
  const admissionInfo = useMemo(() => {
    try {
      const sems = Object.keys(khsData)
        .map(Number)
        .sort((a, b) => a - b);
      const first = sems[0];
      const firstYearStr = khsData[first]?.academicYear || academicYear; // fallback
      const startYear = parseInt(String(firstYearStr).split("/")[0] || "", 10) || new Date().getFullYear();
      // Asumsi awal tahun akademik dimulai 1 Agustus
      const startDate = new Date(startYear, 7, 1);
      const now = new Date();
      const durationYears = Math.max(
        0,
        (now.getTime() - startDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      );
      return {
        tanggalMasuk: startDate.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
        tanggalLulus: "-", // Belum lulus; bisa diubah jika ada status kelulusan
        durasiTahun: durationYears.toFixed(1),
      };
    } catch {
      return { tanggalMasuk: "-", tanggalLulus: "-", durasiTahun: "-" };
    }
  }, []);

  const selectedCoursesMemo = useMemo(() => {
    const courseMap: Record<string, { id: string; name: string; sks: number }> = {};
    for (const c of krsCourses) {
      if (selectedMap[c.id]) courseMap[c.id] = { id: c.id, name: c.name, sks: c.sks };
    }
    for (const oc of otherSemesterCourses) {
      if (selectedMap[oc.id]) courseMap[oc.id] = { id: oc.id, name: oc.name, sks: oc.sks };
    }
    return Object.values(courseMap);
  }, [selectedMap]);

  const totalSksMemo = useMemo(() => selectedCoursesMemo.reduce((sum, c) => sum + c.sks, 0), [selectedCoursesMemo]);

  function validateBeforeSubmit() {
    const errs: string[] = [];
    const selectedCourses = selectedCoursesMemo;
    const totalSks = totalSksMemo;

    if (selectedCourses.length === 0) errs.push("Pilih minimal satu mata kuliah.");
    if (totalSks < 12) errs.push("Minimal 12 SKS untuk pengajuan KRS.");
    if (totalSks > 24) errs.push("Maksimal 24 SKS per semester.");

    const allSelected = [...krsCourses, ...otherSemesterCourses].filter((c) => selectedMap[c.id]);
    for (const c of allSelected as (Course | OtherCourse)[]) {
      const clsKey = selectedClasses[c.id] ?? "A";
      const cls = c.classes[clsKey];
      const day = selectedDays[c.id] || cls.day;
      const time = selectedTimes[c.id] || cls.time;
      const lecturer = selectedLecturers[c.id] || cls.lecturer;
      if (!day || !time) errs.push(`Jadwal belum dipilih lengkap untuk ${c.name}.`);
      if (!lecturer) errs.push(`Dosen belum dipilih untuk ${c.name}.`);
      if (cls.remaining === 0) errs.push(`${c.name} kelas ${clsKey} kuota habis.`);
    }

    setSubmitErrors(errs);
    return errs.length === 0;
  }

  async function confirmSubmit() {
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setSubmitted(true);
      setShowConfirm(false);
      const items = selectedCoursesMemo.map((c) => ({
        id: c.id,
        name: c.name,
        sks: c.sks,
        cls: (selectedClasses[c.id] ?? "A") as "A" | "B",
      }));
      submitKrs?.({ items });
    } finally {
      setIsSubmitting(false);
    }
  }

  function onSubmitClick() {
    if (!validateBeforeSubmit()) return;
    setShowConfirm(true);
  }

  return (
    <MobileLayout title="KRS / KHS" bgImage="/bg simple.png">
      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">KRS/KHS</h1>
        </div>

        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/20 rounded-full p-1 w-fit">
          <button
            onClick={() => {
              setTab("krs");
              const next = new URLSearchParams(sp);
              next.set("tab", "krs");
              setSp(next);
            }}
            className={`px-4 py-1.5 text-sm rounded-full transition ${tab === "krs" ? "bg-blue-600 text-white" : "text-gray-700"}`}
          >
            Isi KRS
          </button>
          <button
            onClick={() => {
              setTab("khs");
              const next = new URLSearchParams(sp);
              next.set("tab", "khs");
              setSp(next);
            }}
            className={`px-4 py-1.5 text-sm rounded-full transition ${tab === "khs" ? "bg-blue-600 text-white" : "text-gray-700"}`}
          >
            Lihat KHS
          </button>
          <button
            onClick={() => {
              setTab("ipk");
              const next = new URLSearchParams(sp);
              next.set("tab", "ipk");
              setSp(next);
            }}
            className={`px-4 py-1.5 text-sm rounded-full transition ${tab === "ipk" ? "bg-blue-600 text-white" : "text-gray-700"}`}
          >
            Lihat IPK
          </button>
        </div>

        {tab === "krs" ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Semester {currentSemester} – {academicYear} {season}</p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setKrsFilter("active")}
                className={`px-3 py-1.5 text-xs rounded-full border transition ${
                  krsFilter === "active" ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                Semester Aktif
              </button>
              <button
                onClick={() => setKrsFilter("other")}
                className={`px-3 py-1.5 text-xs rounded-full border transition ${
                  krsFilter === "other" ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                Semester Lainnya
              </button>
            </div>

            {krsFilter === "active" && krsCourses.map((c) => {
              const selected = (selectedClasses[c.id] ?? "A") as "A" | "B";
              const d = c.classes[selected];
              const dayOptions = [d.day, ...(d.additionalDays || [])];
              const timeOptions = [d.time, ...(d.additionalTimes || [])];
              const dayValue = selectedDays[c.id] || d.day;
              const timeValue = selectedTimes[c.id] || d.time;
              const isSelected = selectedMap[c.id] ?? false;
              return (
                <div key={c.id} className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-gray-900">{c.name}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <span>{selectedLecturers[c.id] || d.lecturer}</span>
                        {(d.additionalLecturers?.length || 0) > 0 && (
                          <button
                            type="button"
                            className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                            onClick={() => openLecturers(c.id, [d.lecturer, ...(d.additionalLecturers || [])])}
                          >
                            +{d.additionalLecturers!.length}
                          </button>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <button
                          type="button"
                          className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-[11px] text-gray-700 hover:bg-gray-200"
                          onClick={() => openSchedule(c.id, dayOptions, timeOptions, { day: dayValue, time: timeValue })}
                        >
                          {dayValue}, {timeValue}
                        </button>

                      </div>
                      <div className={`text-xs mt-1 ${d.remaining === 0 ? "text-red-600 font-medium" : "text-gray-600"}`}>
                        {d.remaining === 0 ? "Kuota habis" : `Sisa kuota: ${d.remaining}`}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <select
                        className="text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-60"
                        value={selected}
                        onChange={(e) => {
                          if (submitted) return;
                          setSelectedClasses((prev) => ({ ...prev, [c.id]: e.target.value as "A" | "B" }));
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
                          disabled={submitted || d.remaining === 0}
                        />
                        <span className="select-none">{isSelected ? "Dipilih" : d.remaining === 0 ? "Kuota Habis" : "Pilih"}</span>
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}

            {krsFilter === "other" && (
              <div className="space-y-3">
                {otherSemesterCourses
                  .filter((oc) => oc.season === season && oc.originSemester !== currentSemester)
                  .map((oc) => {
                    const selected = (selectedClasses[oc.id] ?? "A") as "A" | "B";
                    const d = oc.classes[selected];
                    const dayOptions = [d.day, ...(d.additionalDays || [])];
                    const timeOptions = [d.time, ...(d.additionalTimes || [])];
                    const dayValue = selectedDays[oc.id] || d.day;
                    const timeValue = selectedTimes[oc.id] || d.time;
                    const isSelected = selectedMap[oc.id] ?? false;
                    return (
                      <div key={oc.id} className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold text-gray-900">{oc.name}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              Semester {oc.originSemester} – {oc.season} {oc.isElective ? "• Pilihan" : "• Wajib"}
                            </div>
                            <div className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                              <span>{selectedLecturers[oc.id] || d.lecturer}</span>
                              {(d.additionalLecturers?.length || 0) > 0 && (
                                <button
                                  type="button"
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                                  onClick={() => openLecturers(oc.id, [d.lecturer, ...(d.additionalLecturers || [])])}
                                >
                                  +{d.additionalLecturers!.length}
                                </button>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                              <button
                                type="button"
                                className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-[11px] text-gray-700 hover:bg-gray-200"
                                onClick={() =>
                                  openSchedule(oc.id, dayOptions, timeOptions, { day: dayValue, time: timeValue })
                                }
                              >
                                {dayValue}, {timeValue}
                              </button>

                            </div>
                            <div className={`text-xs mt-1 ${d.remaining === 0 ? "text-red-600 font-medium" : "text-gray-600"}`}>
                              {d.remaining === 0 ? "Kuota habis" : `Sisa kuota: ${d.remaining}`}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <select
                              className="text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
                              value={selected}
                              onChange={(e) =>
                                setSelectedClasses((prev) => ({ ...prev, [oc.id]: e.target.value as "A" | "B" }))
                              }
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
                              <span className="select-none">{isSelected ? "Dipilih" : d.remaining === 0 ? "Kuota Habis" : "Pilih"}</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        ) : tab === "khs" ? (
          <div className="space-y-3 relative">
            <div className="flex justify-end">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-orange-500 text-white hover:bg-orange-600 shadow"
                aria-label="Download KHS sebagai PDF"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path
                    fillRule="evenodd"
                    d="M3 14a1 1 0 011-1h2a1 1 0 010 2H5v1h10v-1h-1a1 1 0 110-2h2a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm6-11a1 1 0 012 0v7.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4A1 1 0 115.707 8.293L8 10.586V3z"
                    clipRule="evenodd"
                  />
                </svg>
                Download PDF
              </button>
            </div>
            <div className="flex items-center justify-between bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-3">
              <div className="text-sm font-medium text-gray-800">Pilih Semester KHS</div>
              <select
                className="text-sm px-2 py-1 rounded-lg bg-gray-100 text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
                value={khsSemester}
                onChange={(e) => setKhsSemester(Number(e.target.value))}
              >
                {Array.from({ length: currentSemester }, (_, i) => currentSemester - i).map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            {(() => {
              const data = khsData[khsSemester];
              if (!data) {
                return (
                  <div className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm text-sm text-gray-700">
                    Data KHS untuk semester {khsSemester} belum tersedia.
                  </div>
                );
              }
              const totalSks = data.courses.reduce((sum, c) => sum + c.sks, 0);
              const totalNxS = data.courses.reduce((sum, c) => sum + gradePoint(c.grade) * c.sks, 0);
              const ip = totalSks > 0 ? totalNxS / totalSks : 0;

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
              const ipk = cumSks > 0 ? cumNxS / cumSks : 0;
              return (
                <div ref={khsRef} id="khs-print" className="space-y-3">
                  <div className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm">
                    <div className="text-lg font-semibold text-gray-900">Kartu Hasil Studi</div>
                    <div className="text-xs text-gray-600">
                      Semester {khsSemester} – Tahun Akademik {data.academicYear}
                    </div>
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
                            <div className="text-xs text-gray-600">
                              Nilai: <span className="font-semibold text-gray-900">{c.grade}</span>
                            </div>
                            <div className="text-xs text-gray-600">
                              Nilai × SKS: <span className="font-semibold text-gray-900">{nxs}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm">
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-800">
                        Total SKS <span className="font-semibold text-gray-900">{totalSks}</span>
                      </div>
                      <div className="text-gray-800">
                        Total Nilai × SKS <span className="font-semibold text-gray-900">{totalNxS}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-800">
                      IP Semester <span className="font-semibold text-gray-900">{ip.toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-gray-800">
                      IPK (Kumulatif) <span className="font-semibold text-gray-900">{ipk.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm">
              <div className="text-lg font-semibold text-gray-900">Indeks Prestasi</div>
              <p className="text-xs text-gray-600 mt-1">Ringkasan IPK kumulatif dan tren IPS per semester.</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="text-[11px] text-gray-600">IPK</div>
                  <div className="text-xl font-bold text-gray-900">{ipkSummary.ipk.toFixed(2)}</div>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="text-[11px] text-gray-600">Total SKS</div>
                  <div className="text-xl font-bold text-gray-900">{ipkSummary.totalSks}</div>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="text-[11px] text-gray-600">IPS Terakhir</div>
                  <div className="text-xl font-bold text-gray-900">{ipkSummary.lastIps.toFixed(2)}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1 text-xs text-gray-800">
                <div className="flex items-baseline">
                  <div className="w-32 shrink-0 font-semibold whitespace-nowrap">Tanggal Masuk</div>
                  <div className="w-2">:</div>
                  <div className="font-bold text-gray-900">{admissionInfo.tanggalMasuk}</div>
                </div>
                <div className="flex items-baseline">
                  <div className="w-32 shrink-0 font-semibold whitespace-nowrap">Tanggal Lulus</div>
                  <div className="w-2">:</div>
                  <div className="font-bold text-gray-900">{admissionInfo.tanggalLulus}</div>
                </div>
                <div className="flex items-baseline">
                  <div className="w-32 shrink-0 font-semibold whitespace-nowrap">Sudah menempuh</div>
                  <div className="w-2">:</div>
                  <div className="font-bold text-gray-900">{admissionInfo.durasiTahun} tahun</div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm">
              <div className="text-sm font-semibold text-gray-900 mb-2">Tren IPS per Semester</div>
              <div className="space-y-2">
                {ipsBySemester.map((r) => (
                  <div key={r.semester} className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-700">
                      <span>
                        Semester {r.semester} <span className="text-gray-500">({r.academicYear} • {r.totalSks} SKS)</span>
                      </span>
                      <span className="font-semibold">{r.ip.toFixed(2)}</span>
                    </div>
                    <div className="h-2 rounded bg-gray-100">
                      <div
                        className="h-2 rounded bg-orange-500"
                        style={{ width: `${Math.max(0, Math.min(100, (r.ip / 4) * 100))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-[11px] text-gray-500">Skala 0–4</div>
            </div>
          </div>
        )}

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

        {submitErrors.length > 0 && (
          <div className="bg-red-50 text-red-700 text-sm rounded-xl p-3">
            <ul className="list-disc pl-5 space-y-1">
              {submitErrors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        {tab === "krs" && (
          <div className="sticky bottom-4">
            <button
              onClick={onSubmitClick}
              disabled={submitted}
              className={`w-full py-3 rounded-full font-semibold shadow transition ${
                submitted
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-br from-orange-500 to-orange-400 text-white hover:from-orange-600 hover:to-orange-500"
              }`}
            >
              {submitted ? "Menunggu Persetujuan PA" : "Kirim KRS ke Dosen PA"}
            </button>
          </div>
        )}
      </div>

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
              <button className="py-2 rounded-full border border-gray-300 text-gray-700" onClick={() => setShowConfirm(false)} disabled={isSubmitting}>
                Batal
              </button>
              <button className={`py-2 rounded-full text-white ${isSubmitting ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"}`} onClick={confirmSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Mengirim..." : "Kirim"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl w-full sm:max-w-md mx-4 p-4 shadow-lg">
            {modal.kind === "lecturers" ? (
              <>
                <div className="font-semibold text-gray-900">
                  Dosen Lain di dalam {(() => {
                    const id = modal.courseId;
                    if (!id) return "Mata Kuliah";
                    const c = krsCourses.find((x) => x.id === id) || otherSemesterCourses.find((x) => x.id === id);
                    const name = c?.name || "Mata Kuliah";
                    const cls = (id ? selectedClasses[id] : undefined) || "A";
                    return `${name} (${cls})`;
                  })()}
                </div>
                <div className="mt-3 max-h-64 overflow-auto divide-y">
                  {modal.options?.lecturers?.map((name: string, idx: number) => (
                    <button
                      key={idx}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm text-gray-800"
                      onClick={() => {
                        if (!modal.courseId) return;
                        setSelectedLecturers((prev) => ({ ...prev, [modal.courseId!]: name }));
                        closeModal();
                      }}
                    >
                      {name}
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  <button className="w-full py-2 rounded-full border border-gray-300 text-gray-700" onClick={closeModal}>
                    Tutup
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="font-semibold text-gray-900">
                  Jadwal Lain di dalam {(() => {
                    const id = modal.courseId;
                    if (!id) return "Mata Kuliah";
                    const c = krsCourses.find((x) => x.id === id) || otherSemesterCourses.find((x) => x.id === id);
                    const name = c?.name || "Mata Kuliah";
                    const cls = (id ? selectedClasses[id] : undefined) || "A";
                    return `${name} (${cls})`;
                  })()}
                </div>
                <div className="mt-3 max-h-64 overflow-auto divide-y">
                  {modal.options?.combos?.map((opt: { day: string; time: string }, idx: number) => {
                    const label = `${opt.day}, ${opt.time}`;
                    const isCurrent =
                      modal.options?.current?.day === opt.day && modal.options?.current?.time === opt.time;
                    return (
                      <button
                        key={`${opt.day}-${opt.time}-${idx}`}
                        type="button"
                        className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm ${isCurrent ? "bg-orange-50" : "text-gray-800"}`}
                        onClick={() => {
                          if (!modal.courseId) return;
                          setSelectedDays((prev) => ({ ...prev, [modal.courseId!]: opt.day }));
                          setSelectedTimes((prev) => ({ ...prev, [modal.courseId!]: opt.time }));
                          closeModal();
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3">
                  <button className="w-full py-2 rounded-full border border-gray-300 text-gray-700" onClick={closeModal}>
                    Tutup
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </MobileLayout>
  );
}

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
 
