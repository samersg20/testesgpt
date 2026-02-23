"use client";

import { useCallback, useEffect, useState } from "react";
import { STORAGE_METHODS } from "@/lib/constants";

type Row = { id: string; createdAt: string; expiresAt: string; storageMethod: string; quantity: number; item: { name: string }; user: { name: string } };
type Named = { id: string; name: string };

export function HistoryClient() {
  const [rows, setRows] = useState<Row[]>([]);
  const [items, setItems] = useState<Named[]>([]);
  const [users, setUsers] = useState<Named[]>([]);
  const [filters, setFilters] = useState({ itemId: "", storageMethod: "", userId: "", start: "", end: "" });

  const load = useCallback(async () => {
    const qp = new URLSearchParams(filters);
    const res = await fetch(`/api/history?${qp.toString()}`);
    setRows(await res.json());
  }, [filters]);

  useEffect(() => {
    fetch("/api/items").then((r) => r.json()).then((data: Named[]) => setItems(data));
    fetch("/api/users").then((r) => r.json()).then((data: Named[]) => setUsers(data));
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Histórico de emissões</h1>
      <div className="mb-4 grid grid-cols-5 gap-2">
        <select className="rounded border p-2" value={filters.itemId} onChange={(e) => setFilters({ ...filters, itemId: e.target.value })}><option value="">Item</option>{items.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}</select>
        <select className="rounded border p-2" value={filters.storageMethod} onChange={(e) => setFilters({ ...filters, storageMethod: e.target.value })}><option value="">Método</option>{STORAGE_METHODS.map((m) => <option key={m}>{m}</option>)}</select>
        <select className="rounded border p-2" value={filters.userId} onChange={(e) => setFilters({ ...filters, userId: e.target.value })}><option value="">Usuário</option>{users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</select>
        <input className="rounded border p-2" type="date" value={filters.start} onChange={(e) => setFilters({ ...filters, start: e.target.value })} />
        <input className="rounded border p-2" type="date" value={filters.end} onChange={(e) => setFilters({ ...filters, end: e.target.value })} />
      </div>
      <button className="mb-4 rounded bg-black px-3 py-1 text-white" onClick={load}>Filtrar</button>
      <table className="w-full border"><thead><tr className="bg-gray-100"><th>Data</th><th>Item</th><th>Método</th><th>Qtd</th><th>Validade</th><th>Status</th><th>Usuário</th></tr></thead><tbody>{rows.map((r) => { const expired = new Date(r.expiresAt) < new Date(); return <tr key={r.id} className="border-t"><td>{new Date(r.createdAt).toLocaleString("pt-BR")}</td><td>{r.item.name}</td><td>{r.storageMethod}</td><td>{r.quantity}</td><td>{new Date(r.expiresAt).toLocaleString("pt-BR")}</td><td>{expired ? "VENCIDO" : "OK"}</td><td>{r.user.name}</td></tr>; })}</tbody></table>
    </div>
  );
}
