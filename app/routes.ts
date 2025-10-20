import { type RouteConfig, index, route } from "@react-router/dev/routes";

// Index route (home) and other app routes
export default [
	index("routes/home.tsx"),
	route("login", "routes/login.tsx"),
	route("presensi", "routes/presensi.tsx"),
	route("presensi/:id", "routes/presensi.$id.tsx"),
	route("schedule", "routes/schedule.tsx"),
	route("notifications", "routes/notifications.tsx"),
	route("notification/:id", "routes/notification.$id.tsx"),
	route("messages", "routes/messages.tsx"),
	route("chat/:id", "routes/chat.$id.tsx"),
	route("news/:id", "routes/news.$id.tsx"),
	route("announcements/:id", "routes/announcement.$id.tsx"),
	route("pembayaran", "routes/pembayaran.tsx"),
	route("pembayaran/:id", "routes/pembayaran.$id.tsx"),
	route("detail-pembayaran", "routes/detail-pembayaran.tsx"),
	route("pay-now", "routes/pay-now.tsx"),
	route("select-payment", "routes/select-payment.tsx"),
	route("confirm-payment", "routes/confirm-payment.tsx"),
	route("krs-khs", "routes/krs-khs.tsx"),
	route("status-krs", "routes/status-krs.tsx"),
	route("profile", "routes/profile.tsx"),
	route("edit-profile", "routes/edit-profile.tsx"),
	route("pengajuan", "routes/pengajuan.tsx"),
	route("log-bimbingan", "routes/log-bimbingan.tsx"),
	route("dev", "routes/dev.tsx"),
] satisfies RouteConfig;
