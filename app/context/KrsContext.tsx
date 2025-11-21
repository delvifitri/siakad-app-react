import React, { createContext, useContext, useMemo, useState } from "react";

export type KrsStatus = "disetujui" | "menunggu" | "ditolak";

export type KrsItem = {
  id: string;
  name: string;
  sks: number;
  cls: "A" | "B";
  status: KrsStatus;
};

export type KrsSubmission = {
  submitted: boolean;
  submittedAt?: string; // ISO string
  advisor?: string;
  items: KrsItem[];
};

type KrsContextValue = {
  submission: KrsSubmission;
  submitKrs: (args: { items: Omit<KrsItem, "status">[]; advisor?: string; submittedAt?: string; initialStatus?: KrsStatus }) => void;
  setApprovals: (approvedIds: string[], rejectedIds?: string[]) => void;
  resetKrs: () => void;
};

const KrsContext = createContext<KrsContextValue | undefined>(undefined);

export function KrsProvider({ children }: { children: React.ReactNode }) {
  const [submission, setSubmission] = useState<KrsSubmission>({ submitted: false, items: [] });

  const submitKrs: KrsContextValue["submitKrs"] = ({ items, advisor, submittedAt, initialStatus = "menunggu" }) => {
    setSubmission({
      submitted: true,
      advisor,
      submittedAt: submittedAt || new Date().toISOString(),
      items: items.map((it) => ({ ...it, status: initialStatus })),
    });
  };

  const setApprovals: KrsContextValue["setApprovals"] = (approvedIds, rejectedIds = []) => {
    setSubmission((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        approvedIds.includes(it.id)
          ? { ...it, status: "disetujui" }
          : rejectedIds.includes(it.id)
          ? { ...it, status: "ditolak" }
          : it
      ),
    }));
  };

  const resetKrs = () => setSubmission({ submitted: false, items: [] });

  const value = useMemo<KrsContextValue>(() => ({ submission, submitKrs, setApprovals, resetKrs }), [submission]);
  return <KrsContext.Provider value={value}>{children}</KrsContext.Provider>;
}

export function useKrsContext(): KrsContextValue {
  const ctx = useContext(KrsContext);
  if (!ctx) throw new Error("useKrsContext must be used within KrsProvider");
  return ctx;
}
