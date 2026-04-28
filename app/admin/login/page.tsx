"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function LoginAdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      router.push("/admin/produtos");
    } catch {
      alert("E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-8 text-white">
      <form
        onSubmit={entrar}
        className="w-full max-w-md rounded-[32px] border border-[#d9a441]/50 bg-zinc-950 p-6 shadow-2xl"
      >
        <img
          src="/patroas-do-gole.jpeg.jpeg"
          alt="Patroas do Gole"
          className="mx-auto mb-4 w-full max-w-xs rounded-2xl"
        />

        <h1 className="text-center text-2xl font-black text-[#d9a441]">
          Painel Administrativo
        </h1>

        <p className="mb-6 mt-2 text-center text-sm text-zinc-400">
          Gerencie produtos, preços e categorias do cardápio
        </p>

        <label className="mb-2 block text-sm font-semibold">E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-xl border border-zinc-700 bg-black p-3 text-white outline-none focus:border-pink-500"
          required
        />

        <label className="mb-2 block text-sm font-semibold">Senha</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="mb-6 w-full rounded-xl border border-zinc-700 bg-black p-3 text-white outline-none focus:border-pink-500"
          required
        />

        <button
          disabled={loading}
          className="w-full rounded-xl bg-pink-500 p-3 font-bold text-white transition hover:bg-pink-600 disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
