import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import MobileLayout from "../layouts/MobileLayout";
import { useKrsContext } from "../context/KrsContext";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { khsService } from "../services/khs.service";
import type { KhsResponse } from "../schemas/khs.schema";

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
  const navigate = useNavigate();
  const fromDosen = sp.get("from") === "dosen";
  const disableKrs = sp.get("disableKrs") === "true";
  const initialTab =
    (sp.get("tab") as "krs" | "khs" | "ipk") || (disableKrs ? "ipk" : "krs");
  const [tab, setTab] = useState<"krs" | "khs" | "ipk">(initialTab);
  const [krsFilter, setKrsFilter] = useState<"active" | "other">("active");
  const khsRef = useRef<HTMLDivElement>(null);

  // KHS Data State
  const [khsData, setKhsData] = useState<KhsResponse | null>(null);
  const [khsLoading, setKhsLoading] = useState(false);
  const [khsError, setKhsError] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string>("");

  const [selectedClasses, setSelectedClasses] = useState<
    Record<string, "A" | "B">
  >(() => {
    const initial: Record<string, "A" | "B"> = {};
    for (const c of krsCourses) {
      const match = c.className.match(/Kelas:\s*([A-Z])/i);
      const cls = (match?.[1] as "A" | "B") ?? "A";
      initial[c.id] = cls;
    }
    return initial;
  });

  const [selectedMap, setSelectedMap] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      for (const c of krsCourses) initial[c.id] = c.status === "added";
      return initial;
    }
  );

  const [showConfirm, setShowConfirm] = useState(false);
  const [submitErrors, setSubmitErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to IPK tab if KRS is disabled and user tries to access KRS or KHS
  useEffect(() => {
    if (disableKrs && (tab === "krs" || tab === "khs")) {
      setTab("ipk");
      const next = new URLSearchParams(sp);
      next.set("tab", "ipk");
      setSp(next);
    }
  }, [disableKrs, tab, sp, setSp]);
  const [submitted, setSubmitted] = useState(false);

  const [selectedTimes, setSelectedTimes] = useState<Record<string, string>>(
    {}
  );
  const [selectedDays, setSelectedDays] = useState<Record<string, string>>({});
  const [selectedLecturers, setSelectedLecturers] = useState<
    Record<string, string>
  >({});

  const [modal, setModal] = useState<{
    open: boolean;
    kind: "lecturers" | "schedule";
    courseId: string | null;
    options?: any;
  }>({ open: false, kind: "lecturers", courseId: null });

  // Fetch KHS Data
  useEffect(() => {
    if (tab === "khs") {
      fetchKhsData(selectedSemester);
    }
  }, [tab, selectedSemester]);

  const fetchKhsData = async (semester?: string) => {
    setKhsLoading(true);
    setKhsError(null);
    try {
      const response = await khsService.getKhs(semester);
      setKhsData(response);
      // Set default selected semester if not set
      if (!selectedSemester && response.data.active_semester) {
        setSelectedSemester(response.data.active_semester);
      }
    } catch (err: any) {
      setKhsError(err.message || "Gagal mengambil data KHS");
    } finally {
      setKhsLoading(false);
    }
  };

  function openLecturers(courseId: string, lecturers: string[]) {
    setModal({
      open: true,
      kind: "lecturers",
      courseId,
      options: { lecturers },
    });
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
    setModal({
      open: true,
      kind: "schedule",
      courseId,
      options: { combos, current },
    });
  }
  function closeModal() {
    setModal((m) => ({ ...m, open: false }));
  }

  const selectedCoursesMemo = useMemo(() => {
    const courseMap: Record<string, { id: string; name: string; sks: number }> =
      {};
    for (const c of krsCourses) {
      if (selectedMap[c.id])
        courseMap[c.id] = { id: c.id, name: c.name, sks: c.sks };
    }
    for (const oc of otherSemesterCourses) {
      if (selectedMap[oc.id])
        courseMap[oc.id] = { id: oc.id, name: oc.name, sks: oc.sks };
    }
    return Object.values(courseMap);
  }, [selectedMap]);

  function validateBeforeSubmit() {
    // Validasi dihapus sesuai permintaan
    setSubmitErrors([]);
    return true;
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
    <MobileLayout
      title={fromDosen ? "Detail Akademik Mahasiswa" : "KRS / KHS"}
      bgImage="/bg simple.png"
    >
      <div className="p-4 space-y-4">
        {fromDosen && (
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => navigate("/dosen/bimbingan-akademik")}
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Kembali ke Bimbingan Akademik
            </button>
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {fromDosen ? "Detail Akademik Mahasiswa" : "KRS/KHS"}
          </h1>
          {fromDosen && (
            <p className="text-sm text-gray-600 mt-1">
              Melihat data akademik mahasiswa bimbingan
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/20 rounded-full p-1 w-fit">
          <button
            onClick={() => {
              if (disableKrs) return;
              setTab("krs");
              const next = new URLSearchParams(sp);
              next.set("tab", "krs");
              setSp(next);
            }}
            disabled={disableKrs}
            className={`px-4 py-1.5 text-sm rounded-full transition ${
              disableKrs
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : tab === "krs"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700"
            }`}
          >
            Isi KRS
          </button>
          <button
            onClick={() => {
              if (disableKrs) return;
              setTab("khs");
              const next = new URLSearchParams(sp);
              next.set("tab", "khs");
              setSp(next);
            }}
            disabled={disableKrs}
            className={`px-4 py-1.5 text-sm rounded-full transition ${
              disableKrs
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : tab === "khs"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700"
            }`}
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
            <p className="text-sm text-gray-600">
              Semester {currentSemester} – {academicYear} {season}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setKrsFilter("active")}
                className={`px-3 py-1.5 text-xs rounded-full border transition ${
                  krsFilter === "active"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                Semester Aktif
              </button>
              <button
                onClick={() => setKrsFilter("other")}
                className={`px-3 py-1.5 text-xs rounded-full border transition ${
                  krsFilter === "other"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                Semester Lainnya
              </button>
            </div>

            {krsFilter === "active" &&
              krsCourses.map((c) => {
                const selected = (selectedClasses[c.id] ?? "A") as "A" | "B";
                const d = c.classes[selected];
                const dayOptions = [d.day, ...(d.additionalDays || [])];
                const timeOptions = [d.time, ...(d.additionalTimes || [])];
                const dayValue = selectedDays[c.id] || d.day;
                const timeValue = selectedTimes[c.id] || d.time;
                const isSelected = selectedMap[c.id] ?? false;
                return (
                  <div
                    key={c.id}
                    className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {c.name}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                          <span>{selectedLecturers[c.id] || d.lecturer}</span>
                          {(d.additionalLecturers?.length || 0) > 0 && (
                            <button
                              type="button"
                              className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                              onClick={() =>
                                openLecturers(c.id, [
                                  d.lecturer,
                                  ...(d.additionalLecturers || []),
                                ])
                              }
                            >
                              +{d.additionalLecturers!.length}
                            </button>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                          <span className="text-gray-700">
                            {dayValue}, {timeValue}
                          </span>
                          {Math.max(
                            0,
                            dayOptions.length * timeOptions.length - 1
                          ) > 0 && (
                            <button
                              type="button"
                              title={`${Math.max(0, dayOptions.length * timeOptions.length - 1)} jadwal lain`}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                              onClick={() =>
                                openSchedule(c.id, dayOptions, timeOptions, {
                                  day: dayValue,
                                  time: timeValue,
                                })
                              }
                            >
                              +
                              {Math.max(
                                0,
                                dayOptions.length * timeOptions.length - 1
                              )}
                            </button>
                          )}
                        </div>
                        <div
                          className={`text-xs mt-1 ${d.remaining === 0 ? "text-red-600 font-medium" : "text-gray-600"}`}
                        >
                          {d.remaining === 0
                            ? "Kuota habis"
                            : `Sisa kuota: ${d.remaining}`}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <select
                          className="text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-60"
                          value={selected}
                          onChange={(e) => {
                            if (submitted) return;
                            setSelectedClasses((prev) => ({
                              ...prev,
                              [c.id]: e.target.value as "A" | "B",
                            }));
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
                              setSelectedMap((prev) => ({
                                ...prev,
                                [c.id]: !isSelected,
                              }));
                            }}
                            disabled={submitted || d.remaining === 0}
                          />
                          <span className="select-none">
                            {isSelected
                              ? "Dipilih"
                              : d.remaining === 0
                                ? "Kuota Habis"
                                : "Pilih"}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                );
              })}

            {krsFilter === "other" && (
              <div className="space-y-3">
                {otherSemesterCourses
                  .filter(
                    (oc) =>
                      oc.season === season &&
                      oc.originSemester !== currentSemester
                  )
                  .map((oc) => {
                    const selected = (selectedClasses[oc.id] ?? "A") as
                      | "A"
                      | "B";
                    const d = oc.classes[selected];
                    const dayOptions = [d.day, ...(d.additionalDays || [])];
                    const timeOptions = [d.time, ...(d.additionalTimes || [])];
                    const dayValue = selectedDays[oc.id] || d.day;
                    const timeValue = selectedTimes[oc.id] || d.time;
                    const isSelected = selectedMap[oc.id] ?? false;
                    return (
                      <div
                        key={oc.id}
                        className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {oc.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Semester {oc.originSemester} – {oc.season}{" "}
                              {oc.isElective ? "• Pilihan" : "• Wajib"}
                            </div>
                            <div className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                              <span>
                                {selectedLecturers[oc.id] || d.lecturer}
                              </span>
                              {(d.additionalLecturers?.length || 0) > 0 && (
                                <button
                                  type="button"
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                                  onClick={() =>
                                    openLecturers(oc.id, [
                                      d.lecturer,
                                      ...(d.additionalLecturers || []),
                                    ])
                                  }
                                >
                                  +{d.additionalLecturers!.length}
                                </button>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                              <span className="text-gray-700">
                                {dayValue}, {timeValue}
                              </span>
                              {Math.max(
                                0,
                                dayOptions.length * timeOptions.length - 1
                              ) > 0 && (
                                <button
                                  type="button"
                                  title={`${Math.max(0, dayOptions.length * timeOptions.length - 1)} jadwal lain`}
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                                  onClick={() =>
                                    openSchedule(
                                      oc.id,
                                      dayOptions,
                                      timeOptions,
                                      { day: dayValue, time: timeValue }
                                    )
                                  }
                                >
                                  +
                                  {Math.max(
                                    0,
                                    dayOptions.length * timeOptions.length - 1
                                  )}
                                </button>
                              )}
                            </div>
                            <div
                              className={`text-xs mt-1 ${d.remaining === 0 ? "text-red-600 font-medium" : "text-gray-600"}`}
                            >
                              {d.remaining === 0
                                ? "Kuota habis"
                                : `Sisa kuota: ${d.remaining}`}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <select
                              className="text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
                              value={selected}
                              onChange={(e) =>
                                setSelectedClasses((prev) => ({
                                  ...prev,
                                  [oc.id]: e.target.value as "A" | "B",
                                }))
                              }
                              disabled={submitted}
                            >
                              <option value="A">Kelas A</option>
                              <option value="B">Kelas B</option>
                            </select>
                            <div className="text-xs text-gray-600">
                              {oc.sks} SKS
                            </div>
                            <label className="inline-flex items-center gap-2 text-xs text-gray-700">
                              <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-400 disabled:opacity-60"
                                checked={isSelected}
                                onChange={() => {
                                  if (submitted) return;
                                  setSelectedMap((prev) => ({
                                    ...prev,
                                    [oc.id]: !isSelected,
                                  }));
                                }}
                                disabled={submitted || d.remaining === 0}
                              />
                              <span className="select-none">
                                {isSelected
                                  ? "Dipilih"
                                  : d.remaining === 0
                                    ? "Kuota Habis"
                                    : "Pilih"}
                              </span>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
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
              <div className="text-sm font-medium text-gray-800">
                Pilih Semester KHS
              </div>
              <select
                className="text-sm px-2 py-1 rounded-lg bg-gray-100 text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                disabled={khsLoading}
              >
                {khsData?.data.semesters.map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            {khsLoading ? (
              <div className="flex justify-center p-8">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : khsError ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center text-sm">
                {khsError}
                <button
                  onClick={() => fetchKhsData(selectedSemester)}
                  className="block mx-auto mt-2 text-xs underline"
                >
                  Coba lagi
                </button>
              </div>
            ) : khsData?.data.khs ? (
              <div ref={khsRef} id="khs-print" className="space-y-3">
                <div className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm">
                  <div className="text-lg font-semibold text-gray-900">
                    Kartu Hasil Studi
                  </div>
                  <div className="text-xs text-gray-600">
                    Semester {khsData.data.khs.semester_info.semester} – Tahun
                    Akademik {khsData.data.khs.semester_info.tahun_ajaran}
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Nama</span>
                      <span className="font-medium text-gray-900">
                        {khsData.data.khs.mahasiswa.nama}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">NIM</span>
                      <span className="font-medium text-gray-900">
                        {khsData.data.khs.mahasiswa.nim}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">PA</span>
                      <span className="font-medium text-gray-900">
                        {khsData.data.khs.dosen_pa.nama}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Prodi</span>
                      <span className="font-medium text-gray-900">
                        {khsData.data.khs.mahasiswa.prodi}
                      </span>
                    </div>
                  </div>
                </div>

                {khsData.data.khs.mata_kuliah.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {c.nama_mk}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Kode: {c.kode_mk}
                        </div>
                        <div className="text-xs text-gray-600">
                          SKS: {c.sks}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-600">
                          Nilai:{" "}
                          <span className="font-semibold text-gray-900">
                            {c.nilai_huruf}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          Nilai × SKS:{" "}
                          <span className="font-semibold text-gray-900">
                            {c.nilai_angka}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm">
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-800">
                      Total SKS{" "}
                      <span className="font-semibold text-gray-900">
                        {khsData.data.khs.summary.total_sks}
                      </span>
                    </div>
                    <div className="text-gray-800">
                      Total Nilai × SKS{" "}
                      <span className="font-semibold text-gray-900">
                        {khsData.data.khs.summary.total_nilai}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-800">
                    IP Semester{" "}
                    <span className="font-semibold text-gray-900">
                      {khsData.data.khs.summary.ips}
                    </span>
                  </div>
                  <div className="text-sm text-gray-800">
                    IPK (Kumulatif){" "}
                    <span className="font-semibold text-gray-900">
                      {khsData.data.khs.summary.ipk}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm text-sm text-gray-700">
                Data KHS tidak tersedia.
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm">
              <div className="text-lg font-semibold text-gray-900">
                Indeks Prestasi
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Ringkasan IPK kumulatif dan tren IPS per semester.
              </p>
              {/* Note: IPK tab data logic might need update if it depends on KHS data, currently keeping as is or using mock */}
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="text-[11px] text-gray-600">IPK</div>
                  <div className="text-xl font-bold text-gray-900">
                    {khsData?.data.khs.summary.ipk || "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
