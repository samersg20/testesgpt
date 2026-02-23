"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export function AppNav() {
  return (
    <nav className="mb-6 flex items-center gap-4 border-b pb-4">
      <Link href="/items">Itens</Link>
      <Link href="/print">Emitir</Link>
      <Link href="/history">Histórico</Link>
      <button className="ml-auto rounded bg-black px-3 py-1 text-white" onClick={() => signOut({ callbackUrl: "/login" })}>Sair</button>
    </nav>
  );
}
