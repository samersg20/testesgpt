"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn("credentials", { email, password, callbackUrl: "/print", redirect: false });
    if (res?.error) setError("Credenciais inválidas");
    else window.location.href = "/print";
  }

  return (
    <div className="mx-auto mt-28 max-w-sm rounded border p-6">
      <h1 className="mb-4 text-2xl font-bold">SafeLabel - Login</h1>
      <form onSubmit={submit} className="space-y-3">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded border p-2" required />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" type="password" className="w-full rounded border p-2" required />
        <button type="submit" className="w-full rounded bg-black p-2 text-white">Entrar</button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <p className="mt-3 text-sm text-gray-500">admin@safelabel.local / 123456</p>
    </div>
  );
}
