import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";

export function meta() {
  return [{ title: "Login - Siakad" }];
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // TODO: add auth logic
    navigate('/');
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/bg color.png')" }}
    >
      <div className="w-full max-w-sm space-y-6">
        <header className="text-center mb-24">
          <h1 className="text-4xl font-extrabold text-white">Software
            <span className="block">Kampus</span>
          </h1>
        </header>

        <section className="space-y-4 px-4 mt-4">
            <label className="sr-only">Email atau NIM</label>
            <div className="flex items-center gap-3 bg-white/60 dark:bg-white/6 rounded-2xl p-4">
              <EnvelopeIcon className="w-5 h-5 text-gray-700" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email atau NIM"
                className="bg-transparent flex-1 outline-none placeholder-gray-700 text-gray-900 dark:placeholder-gray-300 dark:text-white"
              />
            </div>
            <div className="mt-3 flex items-center gap-3 bg-white/60 dark:bg-white/6 rounded-2xl p-4">
              <LockClosedIcon className="w-5 h-5 text-gray-700" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="bg-transparent flex-1 outline-none placeholder-gray-700 text-gray-900 dark:placeholder-gray-300 dark:text-white"
              />
            </div>

          <button onClick={handleLogin} className="w-full mt-2 rounded-full py-4 text-white font-semibold bg-gradient-to-r from-orange-500 to-orange-400 shadow-lg">Masuk</button>

          <div className="text-center">
            <a href="#" className="text-sm text-white/90 underline">Lupa Password?</a>
          </div>
        </section>
      </div>
    </main>
  );
}
