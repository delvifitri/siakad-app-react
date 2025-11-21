import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SimpleLayout from "../layouts/SimpleLayout";

const MIN_BY_TYPE: Record<string, number> = {
	ukt: 100_000,
	praktikum: 20_000,
	kegiatan: 10_000,
};

export function meta() {
	return [
		{ title: "Detail Pembayaran - Siakad" },
		{ name: "description", content: "Form isi nominal pembayaran" },
	];
}

export default function PayNow() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const type = (searchParams.get("type") || "ukt").toLowerCase();
	const titleParam = searchParams.get("title");

	// Ambil semester terpilih dari query agar ringkasan sesuai
	const semParam = searchParams.get("sem");
	const preset = useMemo(
		() => [
			{ year: "2020/2021", season: "Ganjil" },
			{ year: "2021/2022", season: "Genap" },
			{ year: "2023/2024", season: "Ganjil" },
			{ year: "2024/2025", season: "Genap" },
		],
		[]
	);

	const semIndex = useMemo(() => {
		const n = parseInt(semParam || "1", 10);
		if (!Number.isFinite(n) || n < 1) return 0;
		return Math.min(n - 1, preset.length - 1);
	}, [semParam, preset.length]);

	const paymentTitle = useMemo(() => {
		if (titleParam) return titleParam;
		const map: Record<string, string> = {
			ukt: "UKT / SPP",
			praktikum: "Praktikum",
			kegiatan: "Kegiatan Mahasiswa",
		};
		return map[type] || "Pembayaran";
	}, [type, titleParam]);

	const [amountStr, setAmountStr] = useState("");
	const [error, setError] = useState<string | null>(null);

	const minPayment = useMemo(() => MIN_BY_TYPE[type] ?? 50_000, [type]);

	const parseAmount = (s: string) => {
		const digits = s.replace(/[^0-9]/g, "");
		return digits ? parseInt(digits, 10) : 0;
	};

	const formatRp = (n: number) => n.toLocaleString("id-ID");

	const onChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAmountStr(e.target.value);
		if (error) setError(null);
	};

	const onBlurAmount = () => {
		const n = parseAmount(amountStr);
		setAmountStr(n ? formatRp(n) : "");
	};

	const handleSubmit = () => {
		const n = parseAmount(amountStr);
		if (n < minPayment) {
			setError(`Minimal pembayaran Rp ${formatRp(minPayment)}`);
			return;
		}
		navigate("/select-payment", {
			state: {
				paymentDetails: {
					id: `${type}-custom`,
					semester: "",
					type: paymentTitle,
					amount: n,
					dueDate: "",
					status: "Belum Dibayar",
					description: paymentTitle,
					breakdown: [{ item: paymentTitle, amount: n }],
				},
			},
		});
	};

	// Mock daftar tagihan per semester untuk ringkasan (selaras dengan detail-pembayaran)
	const bills = useMemo(
		() => [
			{
				id: "2025-ganjil",
				semester: "Ganjil 2025/2026",
				uktSppAmount: 3000000,
				praktikumAmount: 200000,
				totalAmount: 3200000,
				dueDate: "15 November 2025",
				status: "Belum Dibayar" as const,
			},
			{
				id: "2025-genap",
				semester: "Genap 2024/2025",
				uktSppAmount: 3000000,
				praktikumAmount: 0,
				totalAmount: 3000000,
				dueDate: "15 Mei 2025",
				status: "Sudah Dibayar" as const,
			},
			{
				id: "2024-ganjil",
				semester: "Ganjil 2024/2025",
				uktSppAmount: 2950000,
				praktikumAmount: 150000,
				totalAmount: 3100000,
				dueDate: "15 November 2024",
				status: "Sudah Dibayar" as const,
			},
		],
		[]
	);

	const paymentDetailsForSummary = bills[semIndex] ?? bills[0];

	const paymentItems = useMemo(() => {
		const baseItems = [
			{
				key: "ukt",
				title: "UKT / SPP",
				amount: paymentDetailsForSummary.uktSppAmount,
				paid: paymentDetailsForSummary.status === "Sudah Dibayar",
			},
			{
				key: "praktikum",
				title: "Praktikum",
				amount: paymentDetailsForSummary.praktikumAmount,
				paid: paymentDetailsForSummary.status === "Sudah Dibayar",
			},
			{
				key: "kegiatan",
				title: "Kegiatan Mahasiswa",
				amount: 200000,
				paid: true,
			},
		];
		return baseItems.filter((i) => i.amount > 0);
	}, [paymentDetailsForSummary]);

	return (
		<SimpleLayout title="Detail Pembayaran">
			<div className="space-y-6">
				<div className="rounded-2xl p-6 bg-white/70 backdrop-blur-md ring-1 ring-white/40 shadow-sm">
					<div className="space-y-2">
						<p className="text-sm text-gray-600">Jenis Pembayaran</p>
						<p className="text-xl font-bold text-gray-900">{paymentTitle}</p>
					</div>

					<div className="mt-5 space-y-2">
						<label className="text-sm text-gray-700" htmlFor="amount">Nominal yang akan Dibayar</label>
									<div className="relative">
										<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900 font-bold z-10 select-none pointer-events-none">Rp</span>
							<input
								id="amount"
								inputMode="numeric"
								placeholder="0"
								value={amountStr}
								onChange={onChangeAmount}
								onBlur={onBlurAmount}
								className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/80 backdrop-blur border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-900 placeholder:text-gray-400"
							/>
						</div>
						<p className="text-xs text-gray-500">Minimal Rp {formatRp(minPayment)}. Anda dapat mengisi nominal berapa saja.</p>
						{error && <p className="text-xs text-red-600">{error}</p>}
					</div>
				</div>

				{/* Ringkasan Tagihan Semester Ini */}
				{(() => {
					const total = paymentItems.reduce((sum, it) => sum + it.amount, 0);
					const paid = paymentItems.filter((it) => it.paid).reduce((sum, it) => sum + it.amount, 0);
					const remaining = total - paid;
					return (
						<div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
							<div className="flex justify-between text-sm mb-2">
								<span>Total Tagihan Semester Ini:</span>
								<span className="font-semibold">Rp {formatRp(total)}</span>
							</div>
							<div className="flex justify-between text-sm mb-2">
								<span>Sudah Dibayar</span>
								<span className="font-semibold text-green-700">Rp {formatRp(paid)}</span>
							</div>
							<hr className="border-gray-200 my-2" />
							<div className="flex justify-between text-sm">
								<span>Sisa</span>
								<span className="font-semibold text-red-700">Rp {formatRp(remaining)}</span>
							</div>
						</div>
					);
				})()}

				<button
					onClick={handleSubmit}
					className="w-full bg-orange-500 text-white py-4 px-6 rounded-3xl font-semibold text-lg hover:bg-orange-600 transition-colors shadow-lg"
				>
					Bayar Sekarang
				</button>
			</div>
		</SimpleLayout>
	);
}

