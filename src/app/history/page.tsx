import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppNav } from "@/components/nav";
import { HistoryClient } from "@/components/history-client";

export default async function HistoryPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect("/login");

  return (
    <main>
      <AppNav />
      <HistoryClient />
    </main>
  );
}
