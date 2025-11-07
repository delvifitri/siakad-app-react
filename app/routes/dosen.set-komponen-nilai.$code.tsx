import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import DosenLayout from "../layouts/DosenLayout";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import ArrowLeftIcon from "../components/ArrowLeftIcon";

export function meta() {
  return [{ title: "Set Komponen Nilai - Siakad" }];
}

const availableComponents = [
  { key: "tugas", label: "Tugas" },
  { key: "kuis", label: "Kuis" },
  { key: "uts", label: "UTS" },
  { key: "uas", label: "UAS" },
  { key: "presensi", label: "Presensi" },
];

export default function DosenSetKomponenNilai() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>(availableComponents[0].key);
  const [weight, setWeight] = useState<number | "">(""
  );
  const [komponenList, setKomponenList] = useState<Array<{ key: string; label: string; bobot: number }>>([
    { key: "tugas", label: "Tugas", bobot: 30 },
    { key: "uts", label: "UTS", bobot: 30 },
    { key: "uas", label: "UAS", bobot: 40 },
  ]);

  const addKomponen = () => {
    if (!selected) return;
    const lbl = availableComponents.find((c) => c.key === selected)?.label || selected;
    const b = Number(weight) || 0;
    setKomponenList((prev) => [...prev, { key: selected, label: lbl, bobot: b }]);
    setWeight("");
  };

  const removeKomponen = (key: string, idx: number) => {
    setKomponenList((prev) => prev.filter((_, i) => i !== idx));
  };

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingWeight, setEditingWeight] = useState<number | "">("");

  const startEdit = (idx: number) => {
    setEditingIndex(idx);
    setEditingWeight(komponenList[idx]?.bobot ?? "");
  };

  const saveEdit = (idx: number) => {
    if (editingIndex === null) return;
    setKomponenList((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], bobot: Number(editingWeight) || 0 };
      return next;
    });
    setEditingIndex(null);
    setEditingWeight("");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingWeight("");
  };

  return (
    <DosenLayout bgImage="/bg simple.png">
      <section className="px-4 pt-6 pb-10">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Set Komponen Nilai</h1>
            <p className="text-sm text-gray-600">{code ? `Mata Kuliah: ${code}` : "Pilih komponen untuk mata kuliah"}</p>
          </div>
        </div>

  <div className="bg-white/30 backdrop-blur-sm rounded-xl border border-white/20 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <label htmlFor="komponen" className="sr-only">Komponen</label>
            <select id="komponen" value={selected} onChange={(e) => setSelected(e.target.value)} className="px-3 py-2 border border-transparent bg-white rounded-full shadow-sm text-sm">
              {availableComponents.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>

            <label htmlFor="bobot" className="sr-only">Bobot (%)</label>
            <input id="bobot" type="number" min={0} max={100} value={weight as any} onChange={(e) => setWeight(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Bobot (%)" className="w-32 px-3 py-2 border border-transparent bg-white rounded-full shadow-sm text-sm" />

            <button onClick={addKomponen} className="px-3 py-2 rounded-full bg-blue-600 text-white text-sm">Tambah</button>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Daftar Komponen</h3>
            {komponenList.length === 0 && <div className="text-sm text-gray-600">Belum ada komponen.</div>}
            <ul className="space-y-2">
              {komponenList.map((k, i) => (
                <li key={`${k.key}-${i}`} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                  <div>
                    <div className="font-medium">{k.label}</div>
                    {editingIndex === i ? (
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex items-center rounded-full bg-white px-2 py-1 shadow-sm border border-transparent">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={editingWeight as any}
                            onChange={(e) => setEditingWeight(e.target.value === "" ? "" : Number(e.target.value))}
                            className="w-20 text-sm px-2 py-1 outline-none"
                          />
                          <span className="text-xs text-gray-500">%</span>
                        </div>

                        <button
                          onClick={() => saveEdit(i)}
                          disabled={editingWeight === ""}
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${editingWeight === "" ? "bg-green-300 text-white cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
                        >
                          <CheckIcon className="w-4 h-4" />
                          Save
                        </button>

                        <button onClick={cancelEdit} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-sm hover:bg-gray-200">
                          <XMarkIcon className="w-4 h-4 text-gray-600" />
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-600">Bobot: {k.bobot}%</div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {editingIndex === i ? null : (
                      <>
                        <button onClick={() => startEdit(i)} className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-sm text-blue-600 hover:bg-blue-50">
                          Edit
                        </button>
                        <button onClick={() => removeKomponen(k.key, i)} className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-sm text-red-600 hover:bg-red-50">
                          Hapus
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-3">
            <button onClick={() => navigate(-1)} className="px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm">Selesai</button>
          </div>
        </div>
      </section>
    </DosenLayout>
  );
}
