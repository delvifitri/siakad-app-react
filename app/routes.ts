import { type RouteConfig, index, route } from "@react-router/dev/routes";

// Index route (home) and other app routes
export default [
	index("routes/home.tsx"),
	route("login", "routes/login.tsx"),
	route("presensi", "routes/presensi.tsx"),
	route("pembayaran", "routes/pembayaran.tsx"),
	route("notifications", "routes/notifications.tsx"),
	route("messages", "routes/messages.tsx"),
	route("chat/:id", "routes/chat.$id.tsx"),
	route("news/:id", "routes/news.$id.tsx"),
	route("krs-khs", "routes/krs-khs.tsx"),
	route("profile", "routes/profile.tsx"),
] satisfies RouteConfig;
