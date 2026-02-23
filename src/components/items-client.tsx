"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type Item = {
  id: string;
  name: string;
  type: "INGREDIENTE" | "PREPARACAO";
  chilledHours: number | null;
  frozenHours: number | null;
  ambientHours: number | null;
  hotHours: number | null;
  thawingHours: number | null;
} & { [key: string]: unknown };

type ItemForm = {
  name: string;
  type: "INGREDIENTE" | "PREPARACAO";
  sif: string;
  notes: string;
  chilledHours: string;
  frozenHours: string;
  ambientHours: string;
  hotHours: string;
  thawingHours: string;
};

const empty: ItemForm = { name: "", type: "INGREDIENTE", sif: "", notes: "", chilledHours: "", frozenHours: "", ambientHours: "", hotHours: "", thawingHours: "" };

export function ItemsClient() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<ItemForm>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/items");
    setItems(await res.json());
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const parse = (v: string) => (v ? Number(v) : null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const payload = { ...form, chilledHours: parse(form.chilledHours), frozenHours: parse(form.frozenHours), ambientHours: parse(form.ambientHours), hotHours: parse(form.hotHours), thawingHours: parse(form.thawingHours) };
    await fetch(editingId ? `/api/items/${editingId}` : "/api/items", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setForm(empty);
    setEditingId(null);
    await load();
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Itens</h1>
      <form className="grid grid-cols-2 gap-2" onSubmit={submit}>
        <input className="rounded border p-2" placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <select className="rounded border p-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ItemForm["type"] })}><option>INGREDIENTE</option><option>PREPARACAO</option></select>
        <input className="rounded border p-2" placeholder="SIF" value={form.sif} onChange={(e) => setForm({ ...form, sif: e.target.value })} />
        <input className="rounded border p-2" placeholder="Observações" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        {[["chilledHours", "RESFRIADO"], ["frozenHours", "CONGELADO"], ["ambientHours", "AMBIENTE"], ["hotHours", "QUENTE"], ["thawingHours", "DESCONGELANDO"]].map(([k, l]) => (
          <input key={k} className="rounded border p-2" type="number" min={0} placeholder={`${l} (h)`} value={form[k as keyof ItemForm]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
        ))}
        <button className="col-span-2 rounded bg-black p-2 text-white">{editingId ? "Salvar" : "Criar"}</button>
      </form>

      <table className="mt-6 w-full border">
        <thead><tr className="bg-gray-100"><th>Nome</th><th>Tipo</th><th>Ações</th></tr></thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t">
              <td>{item.name}</td><td>{item.type}</td>
              <td className="space-x-2">
                <button className="rounded border px-2" onClick={() => { setEditingId(item.id); setForm({ ...empty, ...item, type: item.type, sif: String(item.sif ?? ""), notes: String(item.notes ?? ""), chilledHours: String(item.chilledHours ?? ""), frozenHours: String(item.frozenHours ?? ""), ambientHours: String(item.ambientHours ?? ""), hotHours: String(item.hotHours ?? ""), thawingHours: String(item.thawingHours ?? "") }); }}>Editar</button>
                <button className="rounded border px-2" onClick={async () => { await fetch(`/api/items/${item.id}`, { method: "DELETE" }); load(); }}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
