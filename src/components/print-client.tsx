"use client";

import { useEffect, useState } from "react";
import { listPrinters, printRawZpl, resolvePrinter } from "@/lib/qz";
import { STORAGE_METHODS, StorageMethod } from "@/lib/constants";

type Item = { id: string; name: string };

export function PrintClient() {
  const [items, setItems] = useState<Item[]>([]);
  const [itemId, setItemId] = useState("");
  const [storageMethod, setStorageMethod] = useState<StorageMethod>("RESFRIADO");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [printer, setPrinter] = useState<string | null>(null);
  const [printerOptions, setPrinterOptions] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/items").then((r) => r.json()).then((data: Item[]) => { setItems(data); if (data[0]) setItemId(data[0].id); });
    resolvePrinter().then((p) => setPrinter(p)).catch(() => setMessage("QZ Tray não conectado"));
  }, []);

  async function loadPrinters() {
    const names = await listPrinters();
    setPrinterOptions(names as string[]);
  }

  async function print() {
    setMessage("");
    if (!printer) {
      await loadPrinters();
      return setMessage("Selecione uma impressora");
    }

    const res = await fetch("/api/prints", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ itemId, storageMethod, quantity }) });
    const data = await res.json();
    if (!res.ok) return setMessage(data.error || "Erro ao emitir");

    try {
      await printRawZpl(data.zpl, quantity, printer);
      setMessage("Etiqueta enviada para impressão");
    } catch {
      setMessage("Falha ao imprimir. Verifique QZ Tray.");
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Emitir etiqueta</h1>
      <div className="grid max-w-lg gap-3">
        <select className="rounded border p-2" value={itemId} onChange={(e) => setItemId(e.target.value)}>
          {items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <select className="rounded border p-2" value={storageMethod} onChange={(e) => setStorageMethod(e.target.value as StorageMethod)}>
          {STORAGE_METHODS.map((m) => <option key={m}>{m}</option>)}
        </select>
        <input className="rounded border p-2" type="number" min={1} max={50} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        {printer ? <p>Impressora: <b>{printer}</b></p> : <div><button className="rounded border px-2 py-1" onClick={loadPrinters}>Buscar impressoras</button>{printerOptions.length > 0 && <select className="ml-2 rounded border p-1" onChange={(e) => { localStorage.setItem("safelabel-printer", e.target.value); setPrinter(e.target.value); }}><option>Selecione...</option>{printerOptions.map((p) => <option key={p}>{p}</option>)}</select>}</div>}
        <button onClick={print} className="rounded bg-black p-2 text-white">IMPRIMIR</button>
        {message && <p className="text-sm">{message}</p>}
      </div>
    </div>
  );
}
