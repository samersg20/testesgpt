import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppNav } from "@/components/nav";
import { PrintClient } from "@/components/print-client";

export default async function PrintPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect("/login");

  return (
    <main>
      <AppNav />
      <PrintClient />
    </main>
  );
}
