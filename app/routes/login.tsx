import { useState } from "react";
import { useNavigate } from "react-router";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { authService } from "../services/auth.service";
import { loginRequestSchema } from "../schemas/auth.schema";
import Alert, { type AlertVariant } from "../components/Alert";
import { z } from "zod";

export function meta() {
  return [{ title: "Login - Siakad" }];
}

export default function Login() {
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"mahasiswa" | "dosen">("mahasiswa");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    variant: AlertVariant;
  } | null>(null);
  const [errors, setErrors] = useState<{ nim?: string; password?: string }>({});
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Clear previous errors
    setErrors({});
    setAlert(null);

    // Validate form data
    try {
      loginRequestSchema.parse({ nim, password });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { nim?: string; password?: string } = {};
        error.issues.forEach((err: z.ZodIssue) => {
          if (err.path[0] === "nim") {
            fieldErrors.nim = err.message;
          } else if (err.path[0] === "password") {
            fieldErrors.password = err.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }
    }

    // Make API request
    setIsLoading(true);
    try {
      const response = await authService.login({ nim, password });

      if (response.success) {
        // Redirect using React Router navigate
        if (role === "dosen") {
          navigate("/dosen");
        } else {
          navigate("/");
        }
      }
    } catch (error: any) {
      // Show error alert
      const errorMessage = error?.message || "Login gagal. Silakan coba lagi.";
      setAlert({
        message: errorMessage,
        variant: "error",
      });
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleLogin();
    }
  };

  const mainStyle: React.CSSProperties = {
    backgroundImage: "url('/bg color.png')",
    minHeight: "var(--app-height, 100vh)",
  };

  return (
    <main
      className="min-h-app flex items-center justify-center p-4 bg-cover bg-center"
      style={mainStyle}
    >
      <div className="w-full max-w-sm space-y-6">
        <header className="text-center mb-24">
          <h1 className="text-4xl font-extrabold text-white">
            Software
            <span className="block">Kampus</span>
          </h1>
        </header>

        <section className="space-y-4 px-4 mt-4">
          <div className="flex items-center gap-2 bg-white/50 rounded-full p-1 w-fit mx-auto">
            <button
              type="button"
              onClick={() => setRole("mahasiswa")}
              className={`px-4 py-1.5 text-sm rounded-full transition ${
                role === "mahasiswa"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700"
              }`}
            >
              Mahasiswa
            </button>
            <button
              type="button"
              onClick={() => setRole("dosen")}
              className={`px-4 py-1.5 text-sm rounded-full transition ${
                role === "dosen" ? "bg-blue-600 text-white" : "text-gray-700"
              }`}
            >
              Dosen
            </button>
          </div>

          {alert && (
            <div className="mb-4">
              <Alert
                message={alert.message}
                variant={alert.variant}
                onClose={() => setAlert(null)}
              />
            </div>
          )}

          <div>
            <label className="sr-only">NIM</label>
            <div className="flex items-center gap-3 bg-white/60 rounded-2xl p-4">
              <EnvelopeIcon className="w-5 h-5 text-gray-700" />
              <input
                value={nim}
                onChange={(e) => {
                  setNim(e.target.value);
                  setErrors({ ...errors, nim: undefined });
                }}
                onKeyPress={handleKeyPress}
                placeholder={role === "dosen" ? "Email atau NIP" : "NIM"}
                className="bg-transparent flex-1 outline-none placeholder-gray-700 text-gray-900"
                disabled={isLoading}
                autoComplete="off"
              />
            </div>
            {errors.nim && (
              <p className="text-red-600 text-sm mt-1 ml-4">{errors.nim}</p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-3 bg-white/60 rounded-2xl p-4">
              <LockClosedIcon className="w-5 h-5 text-gray-700" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: undefined });
                }}
                onKeyPress={handleKeyPress}
                placeholder="Password"
                className="bg-transparent flex-1 outline-none placeholder-gray-700 text-gray-900"
                disabled={isLoading}
                autoComplete="off"
              />
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1 ml-4">
                {errors.password}
              </p>
            )}
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`w-full mt-2 rounded-full py-4 text-white font-semibold shadow-lg transition-all flex items-center justify-center ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500"
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Masuk"
            )}
          </button>

          <div className="text-center">
            <a href="#" className="text-sm text-white/90 underline">
              Lupa Password?
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
