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
							<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
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

