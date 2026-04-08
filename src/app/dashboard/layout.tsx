import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <Link href="/dashboard" className="text-lg font-bold tracking-tight">
          Readable
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <Link href="/dashboard/search" className="text-sm text-gray-600 hover:text-gray-900">
            Find books
          </Link>
          <Link href="/dashboard/lists" className="text-sm text-gray-600 hover:text-gray-900">
            Lists
          </Link>
          <SignOutButton />
        </div>
      </nav>
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">{children}</main>
    </div>
  );
}
