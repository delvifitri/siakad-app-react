import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import DosenLayout from "../layouts/DosenLayout";
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, ClockIcon, MagnifyingGlassIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import ArrowLeftIcon from "../components/ArrowLeftIcon";

export function meta() {
  return [{ title: "Detail Presensi - Siakad" }];
}

const statuses = [
  { key: "hadir", label: "Hadir", color: "bg-green-500", icon: CheckCircleIcon },
  { key: "izin", label: "Izin", color: "bg-yellow-500", icon: ExclamationTriangleIcon },
  { key: "sakit", label: "Sakit", color: "bg-red-500", icon: XCircleIcon },
  { key: "alfa", label: "Alfa", color: "bg-gray-500", icon: ClockIcon },
];
const dummyStudents = [
  { nim: "12345678", name: "Ahmad Fauzi" },
  { nim: "12345679", name: "Budi Santoso" },
  { nim: "12345680", name: "Citra Dewi" },
  { nim: "12345681", name: "Dedi Rahman" },
  { nim: "12345682", name: "Eka Putri" },
];
export default function DosenPresensiDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [presensi, setPresensi] = useState<Record<string, string>>({});
  const [keterangan, setKeterangan] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [approved, setApproved] = useState<Record<string, boolean>>({});
  const [pendingPresensi, setPendingPresensi] = useState<Record<string, string>>({});
  const [session, setSession] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      const role = localStorage.getItem("userRole");
      if (role !== "dosen") navigate("/", { replace: true });
    } catch {}
  }, [navigate]);

  useEffect(() => {
    // initialize presensi & keterangan in-memory (do not use localStorage)
    const p: Record<string, string> = {};
    const k: Record<string, string> = {};
    if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.MODE === "development") {
      // dev: prefill some dummy statuses for convenience
      dummyStudents.forEach((s, idx) => {
        if (idx === 0 || idx === 1) p[s.nim] = "hadir";
        else if (idx === 2) p[s.nim] = "izin";
        else p[s.nim] = "";
        k[s.nim] = idx === 2 ? "Menunggu surat izin" : "";
      });
    } else {
      dummyStudents.forEach((s) => {
        p[s.nim] = "";
        k[s.nim] = "";
      });
    }
    setPresensi(p);
    setKeterangan(k);

    // always ensure selection keys exist (start unchecked)
    const sel: Record<string, boolean> = {};
    dummyStudents.forEach((s) => (sel[s.nim] = false));
    setSelected(sel);
    // initialize approved flags
    const ap: Record<string, boolean> = {};
    dummyStudents.forEach((s) => (ap[s.nim] = false));
    setApproved(ap);
    // initialize pending presensi (for Belum Presensi selections)
    const pp: Record<string, string> = {};
    dummyStudents.forEach((s) => (pp[s.nim] = ""));
    setPendingPresensi(pp);
  }, [slug]);

  // separate search states for Sudah Presensi and Belum Presensi sections
  const [searchFieldSudah, setSearchFieldSudah] = useState<string>("all");
  const [searchQuerySudah, setSearchQuerySudah] = useState<string>("");
  const [searchFieldBelum, setSearchFieldBelum] = useState<string>("all");
  const [searchQueryBelum, setSearchQueryBelum] = useState<string>("");

  const filteredSudahStudents = (() => {
    const base = dummyStudents.filter((s) => (presensi[s.nim] ?? "") !== "");
    const q = (searchQuerySudah || "").toString().trim().toLowerCase();
    if (!q || (searchFieldSudah === "all" && q === "")) return base;
    if (searchFieldSudah === "name") return base.filter((s) => s.name.toLowerCase().includes(q));
    if (searchFieldSudah === "nim") return base.filter((s) => s.nim.toLowerCase().includes(q));
    return base.filter((s) => s.name.toLowerCase().includes(q) || s.nim.toLowerCase().includes(q));
  })();

  const filteredBelumStudents = (() => {
    const base = dummyStudents.filter((s) => (presensi[s.nim] ?? "") === "");
    const q = (searchQueryBelum || "").toString().trim().toLowerCase();
    if (!q || (searchFieldBelum === "all" && q === "")) return base;
    if (searchFieldBelum === "name") return base.filter((s) => s.name.toLowerCase().includes(q));
    if (searchFieldBelum === "nim") return base.filter((s) => s.nim.toLowerCase().includes(q));
    return base.filter((s) => s.name.toLowerCase().includes(q) || s.nim.toLowerCase().includes(q));
  })();

  const updatePresensi = (nim: string, status: string) => setPresensi((prev) => ({ ...prev, [nim]: status }));
  const updateKeterangan = (nim: string, text: string) => setKeterangan((prev) => ({ ...prev, [nim]: text }));
  const toggleSelected = (nim: string) => setSelected((prev) => ({ ...prev, [nim]: !prev[nim] }));

  const toggleSelectAllSudah = () => {
    const list = filteredSudahStudents.map((s) => s.nim);
    const allSelected = list.length > 0 && list.every((nim) => !!selected[nim]);
    setSelected((prev) => {
      const next = { ...prev };
      list.forEach((nim) => {
        next[nim] = !allSelected;
      });
      return next;
    });
  };

  const toggleSelectAllBelum = () => {
    const list = filteredBelumStudents.map((s) => s.nim);
    const allSelected = list.length > 0 && list.every((nim) => !!selected[nim]);
    setSelected((prev) => {
      const next = { ...prev };
      list.forEach((nim) => {
        next[nim] = !allSelected;
      });
      return next;
    });
  };

  const submitPending = (nim: string) => {
    const val = pendingPresensi[nim] ?? "";
    if (!val) return;
    // commit pending status to presensi
    setPresensi((prev) => ({ ...prev, [nim]: val }));
    // clear pending for this nim
    setPendingPresensi((prev) => ({ ...prev, [nim]: "" }));
    setToast("Presensi dicatat");
    setTimeout(() => setToast(null), 2000);
  };

  const approveSelected = () => {
  const list = filteredSudahStudents.filter((s) => (presensi[s.nim] ?? "") !== "" && selected[s.nim]).map((s) => s.nim);
    if (list.length === 0) return;
    setApproved((prev) => {
      const next = { ...prev };
      list.forEach((nim) => (next[nim] = true));
      return next;
    });
    setToast(`Approved ${list.length} presensi`);
    setTimeout(() => setToast(null), 2500);
  };

  const cancelApproveSelected = () => {
    const list = filteredSudahStudents
      .filter((s) => (presensi[s.nim] ?? "") !== "" && selected[s.nim] && approved[s.nim])
      .map((s) => s.nim);
    if (list.length === 0) return;

    setApproved((prev) => {
      const next = { ...prev };
      list.forEach((nim) => (next[nim] = false));
      return next;
    });

    setToast(`Cancel approve untuk ${list.length} mahasiswa`);
    setTimeout(() => setToast(null), 2500);
  };

  const manualPresensi = () => {
    const list = filteredBelumStudents
      .filter((s) => (presensi[s.nim] ?? "") === "" && selected[s.nim])
      .map((s) => s.nim);
    if (list.length === 0) return;

    setPresensi((prev) => {
      const next = { ...prev };
      list.forEach((nim) => {
        next[nim] = pendingPresensi[nim] && pendingPresensi[nim] !== "" ? pendingPresensi[nim] : "hadir";
      });
      return next;
    });

    setPendingPresensi((prev) => {
      const next = { ...prev };
      list.forEach((nim) => (next[nim] = ""));
      return next;
    });

    setSelected((prev) => {
      const next = { ...prev };
      list.forEach((nim) => (next[nim] = false));
      return next;
    });

    setToast(`Presensi manual dicatat untuk ${list.length} mahasiswa`);
    setTimeout(() => setToast(null), 2500);
  };

  const allSelectedSudah = filteredSudahStudents.length > 0 && filteredSudahStudents.every((s) => !!selected[s.nim]);

  const allSelectedBelum = filteredBelumStudents.length > 0 && filteredBelumStudents.every((s) => !!selected[s.nim]);

  const savePresensi = () => {
    // no persistence to localStorage — keep presensi in state only
    setToast("Presensi disimpan (state saja)");
    setTimeout(() => setToast(null), 3000);
  };

  const resetDummyData = () => {
    if (!(typeof import.meta !== "undefined" && import.meta.env && import.meta.env.MODE === "development")) return;
    const p: Record<string, string> = {};
    const k: Record<string, string> = {};
    dummyStudents.forEach((s, idx) => {
      if (idx === 0 || idx === 1) p[s.nim] = "hadir";
      else if (idx === 2) p[s.nim] = "izin";
      else p[s.nim] = "";
      k[s.nim] = idx === 2 ? "Menunggu surat izin" : "";
    });
    setPresensi(p);
    setKeterangan(k);
    setToast("Dummy data di-reset (state saja)");
    setTimeout(() => setToast(null), 2000);
  };

  const downloadPresensi = () => {
    // build CSV from current state
    const headers = ["NIM", "Nama", "Status", "Keterangan", "Approved"];
    const rows = dummyStudents.map((s) => {
      const status = presensi[s.nim] ?? "";
      const ket = keterangan[s.nim] ?? "";
      const ap = approved[s.nim] ? "YA" : "";
      // escape quotes
      const esc = (v: string) => `"${(v || "").replace(/"/g, '""')}"`;
      return [esc(s.nim), esc(s.name), esc(status), esc(ket), esc(ap)].join(",");
    });

    const csv = [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const name = `presensi-${slug || "session"}.csv`;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setToast(`Presensi diunduh: ${name}`);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <DosenLayout bgImage="/bg simple.png">
      <section className="px-4 pt-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Detail Presensi</h1>
            <p className="text-sm text-gray-600">{session ? `${session.topik || ""} — ${session.pertemuan || ""}` : "Sesi belum terisi"}</p>
          </div>
          {/* download presensi */}
          <div className="flex items-center gap-2">
            <button
              onClick={downloadPresensi}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-blue-600 text-white text-sm shadow-sm hover:bg-blue-700"
              title="Unduh presensi"
              aria-label="Unduh presensi"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <section className="bg-white/60 rounded-xl border border-gray-200 p-3">
            <div className="mb-3">
              <h3 className="text-base font-semibold text-gray-900">Sudah Presensi</h3>
              <div className="mt-2 flex items-center gap-2">
                <select
                  value={searchFieldSudah}
                  onChange={(e) => setSearchFieldSudah(e.target.value)}
                  className="px-2 py-1 border border-transparent bg-white rounded-full text-xs shadow-sm"
                >
                  <option value="all">Semua</option>
                  <option value="name">Nama</option>
                  <option value="nim">NIM</option>
                </select>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <MagnifyingGlassIcon className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuerySudah}
                    onChange={(e) => setSearchQuerySudah(e.target.value)}
                    placeholder="Cari (nama atau NIM)"
                    className="pl-10 pr-3 py-1.5 rounded-full bg-white text-sm w-56 border border-transparent"
                  />
                </div>
              </div>

              <div className="mt-2">
                <button
                  onClick={toggleSelectAllSudah}
                  className="text-sm text-blue-600 hover:underline"
                  aria-pressed={allSelectedSudah}
                >
                  {allSelectedSudah ? "Bersihkan" : "Pilih Semua"}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredSudahStudents.length === 0 && (
                <div className="text-sm text-gray-600">Belum ada yang dipresensi.</div>
              )}

              {filteredSudahStudents.map((s) => (
                  <div key={s.nim} className="flex items-center justify-between p-3 rounded-lg bg-white shadow-sm">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selected[s.nim] ?? false}
                        onChange={() => toggleSelected(s.nim)}
                        className="w-5 h-5 text-blue-600 rounded border-gray-300"
                        aria-label={`Pilih ${s.name}`}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="text-base font-medium text-gray-900">{s.name}</div>
                          {approved[s.nim] && (
                            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                              <CheckCircleIcon className="w-4 h-4" />
                              <span>Approved</span>
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">NIM: {s.nim}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* show a colored badge for the student's status (hadir/izin/sakit/alfa) */}
                      {(() => {
                        const key = presensi[s.nim] ?? "";
                        const st = statuses.find((x) => x.key === key);
                        if (!st) return null;
                        return (
                          <span className={`${st.color} text-white text-sm px-3 py-1 rounded-full inline-flex items-center font-medium`}>{st.label}</span>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              {/* approve action for selected sudapresensi */}
              <div className="pt-3 flex items-center gap-2">
                <button
                  onClick={approveSelected}
                  disabled={filteredSudahStudents.filter((s) => selected[s.nim]).length === 0}
                  className="px-3 py-2 rounded-full bg-green-600 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Approve Selected
                </button>

                <button
                  onClick={cancelApproveSelected}
                  disabled={filteredSudahStudents.filter((s) => selected[s.nim] && approved[s.nim]).length === 0}
                  className="px-3 py-2 rounded-full bg-red-600 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel Approve
                </button>
              </div>
            </div>
          </section>

          <section className="bg-white/60 rounded-xl border border-gray-200 p-3">
            <div className="mb-3">
              <h3 className="text-base font-semibold text-gray-900">Belum Presensi</h3>
              <div className="mt-2 flex items-center gap-2">
                <select
                  value={searchFieldBelum}
                  onChange={(e) => setSearchFieldBelum(e.target.value)}
                  className="px-2 py-1 border border-transparent bg-white rounded-full text-xs shadow-sm"
                >
                  <option value="all">Semua</option>
                  <option value="name">Nama</option>
                  <option value="nim">NIM</option>
                </select>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <MagnifyingGlassIcon className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQueryBelum}
                    onChange={(e) => setSearchQueryBelum(e.target.value)}
                    placeholder="Cari (nama atau NIM)"
                    className="pl-10 pr-3 py-1.5 rounded-full bg-white text-sm w-56 border border-transparent"
                  />
                </div>
              </div>

              <div className="mt-2">
                <button
                  onClick={toggleSelectAllBelum}
                  className="text-sm text-blue-600 hover:underline"
                  aria-pressed={allSelectedBelum}
                >
                  {allSelectedBelum ? "Bersihkan" : "Pilih Semua"}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredBelumStudents.length === 0 && (
                <div className="text-sm text-gray-600">Semua mahasiswa sudah dipresensi.</div>
              )}

              {filteredBelumStudents.map((s) => (
                  <div key={s.nim} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg bg-white shadow-sm gap-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selected[s.nim] ?? false}
                        onChange={() => toggleSelected(s.nim)}
                        className="w-5 h-5 text-blue-600 rounded border-gray-300"
                        aria-label={`Pilih ${s.name}`}
                      />
                      <div>
                        <div className="text-base font-medium text-gray-900">{s.name}</div>
                        <div className="text-sm text-gray-600">NIM: {s.nim}</div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                      <div className="w-full sm:w-44 md:w-56">
                        <label htmlFor={`status-${s.nim}`} className="sr-only">Pilih status untuk {s.name}</label>
                        <select
                          id={`status-${s.nim}`}
                          value={pendingPresensi[s.nim] ?? ""}
                          onChange={(e) => setPendingPresensi((prev) => ({ ...prev, [s.nim]: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Pilih Status</option>
                          {statuses.map((st) => (
                            <option key={st.key} value={st.key}>{st.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="w-full sm:w-56">
                        <label htmlFor={`keterangan-${s.nim}`} className="sr-only">Keterangan untuk {s.name}</label>
                        <textarea
                          id={`keterangan-${s.nim}`}
                          value={keterangan[s.nim] ?? ""}
                          onChange={(e) => updateKeterangan(s.nim, e.target.value)}
                          placeholder="Keterangan (opsional)"
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              {/* manual presensi action for selected belum-presensi */}
              <div className="pt-3">
                <button
                  onClick={manualPresensi}
                  disabled={
                    dummyStudents.filter((s) => (presensi[s.nim] ?? "") === "" && selected[s.nim]).length === 0
                  }
                  className="px-3 py-2 rounded-full bg-blue-600 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Manual Presensi
                </button>
              </div>
            </div>
          </section>
        </div>

        {toast && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg">{toast}</div>
        )}
      </section>
        </DosenLayout>
      );
    }
