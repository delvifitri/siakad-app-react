import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function meta() {
  return [{ title: "Detail Semester - Pembayaran" }];
}

export default function SemesterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // reconstruct semester string from slug
  const semesterKey = id ? decodeURIComponent(id).replace(/-/g, ' ') : '';

  // Redirect to unified detail pembayaran page with semester param
  useEffect(() => {
    if (semesterKey) {
      navigate(`/detail-pembayaran?semester=${encodeURIComponent(semesterKey)}`, { replace: true });
    }
  }, [semesterKey, navigate]);

  return null;
}
