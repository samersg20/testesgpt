"use client";

const preferred = "ZDesigner ZD220";

type QzType = typeof import("qz-tray");

async function getQz(): Promise<QzType> {
  const qz = await import("qz-tray");

  if (!qz.websocket.isActive()) {
    qz.security.setCertificatePromise(async () => "");
    qz.security.setSignaturePromise(async () => "");
    await qz.websocket.connect({ retries: 1, delay: 1 });
  }

  return qz;
}

export async function resolvePrinter() {
  const qz = await getQz();
  const saved = localStorage.getItem("safelabel-printer");
  if (saved) return saved;

  const found = await qz.printers.find(preferred).catch(() => null);
  if (found) {
    localStorage.setItem("safelabel-printer", found);
    return found;
  }

  return null;
}

export async function listPrinters() {
  const qz = await getQz();
  return qz.printers.find();
}

export async function printRawZpl(zpl: string, copies: number, printerName: string) {
  const qz = await getQz();
  const config = qz.configs.create(printerName, { copies });
  await qz.print(config, [{ type: "raw", format: "plain", data: zpl }]);
}
