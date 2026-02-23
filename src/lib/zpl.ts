import { format } from "date-fns";

type LabelInput = {
  name: string;
  storageMethod: string;
  producedAt: Date;
  expiresAt: Date;
  userName: string;
  sif?: string | null;
  notes?: string | null;
};

const cut = (value: string, max: number) =>
  value.length > max ? `${value.slice(0, max - 3)}...` : value;

const sanitize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function makeZplLabel(input: LabelInput) {
  const name = sanitize(cut(input.name, 32));
  const notes = input.notes ? sanitize(cut(input.notes, 42)) : "";
  const sif = input.sif ? sanitize(cut(input.sif, 22)) : "";

  return `^XA
^CI28
^PW480
^LL320
^FO20,18^A0N,38,38^FD${name}^FS
^FO20,64^A0N,28,28^FDMetodo: ${input.storageMethod}^FS
^FO20,102^A0N,24,24^FDProducao: ${format(input.producedAt, "dd/MM/yyyy HH:mm")}^FS
^FO20,132^A0N,24,24^FDValidade: ${format(input.expiresAt, "dd/MM/yyyy HH:mm")}^FS
^FO20,162^A0N,22,22^FDResp: ${sanitize(cut(input.userName, 30))}^FS
${sif ? `^FO20,190^A0N,22,22^FDSIF: ${sif}^FS` : ""}
${notes ? `^FO20,218^A0N,20,20^FDObs: ${notes}^FS` : ""}
^XZ`;
}
