import { type RouteConfig, index, route } from "@react-router/dev/routes";

// Index route (home) and other app routes
export default [
	index("routes/home.tsx"),
	route("login", "routes/login.tsx"),
	route("presensi", "routes/presensi.tsx"),
	route("schedule", "routes/schedule.tsx"),
	route("notifications", "routes/notifications.tsx"),
	route("messages", "routes/messages.tsx"),
	route("chat/:id", "routes/chat.$id.tsx"),
	route("news/:id", "routes/news.$id.tsx"),
	route("announcements/:id", "routes/announcement.$id.tsx"),
	route("pembayaran", "routes/pembayaran.tsx"),
	route("pembayaran/:id", "routes/pembayaran.$id.tsx"),
	route("detail-pembayaran", "routes/detail-pembayaran.tsx"),
	route("select-payment", "routes/select-payment.tsx"),
	route("confirm-payment", "routes/confirm-payment.tsx"),
	route("krs-khs", "routes/krs-khs.tsx"),
	route("profile", "routes/profile.tsx"),
	route("edit-profile", "routes/edit-profile.tsx"),
] satisfies RouteConfig;
