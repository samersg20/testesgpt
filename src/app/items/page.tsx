import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppNav } from "@/components/nav";
import { ItemsClient } from "@/components/items-client";

export default async function ItemsPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect("/login");

  return (
    <main>
      <AppNav />
      <ItemsClient />
    </main>
  );
}
