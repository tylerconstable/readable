import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}
        </h1>
        <p className="mt-1 text-gray-500 text-sm">What are you reading?</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/dashboard/search"
          className="group border border-gray-200 rounded-xl p-6 hover:border-gray-400 transition-colors"
        >
          <div className="text-2xl mb-2">🔍</div>
          <div className="font-medium text-gray-900">Find a book</div>
          <div className="text-sm text-gray-500 mt-1">Search and log what you&apos;re reading</div>
        </Link>
        <Link
          href="/dashboard/log"
          className="group border border-gray-200 rounded-xl p-6 hover:border-gray-400 transition-colors"
        >
          <div className="text-2xl mb-2">📖</div>
          <div className="font-medium text-gray-900">My reading log</div>
          <div className="text-sm text-gray-500 mt-1">All the books you&apos;ve tracked</div>
        </Link>
        <Link
          href="/dashboard/lists"
          className="group border border-gray-200 rounded-xl p-6 hover:border-gray-400 transition-colors"
        >
          <div className="text-2xl mb-2">✨</div>
          <div className="font-medium text-gray-900">My lists</div>
          <div className="text-sm text-gray-500 mt-1">Curated and AI-generated reading lists</div>
        </Link>
      </div>

      {/* Recent activity placeholder */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent reads</h2>
        <div className="border border-dashed border-gray-200 rounded-xl p-12 text-center text-gray-400 text-sm">
          You haven&apos;t logged any books yet.{" "}
          <Link href="/dashboard/search" className="text-gray-900 underline underline-offset-2">
            Find your first one.
          </Link>
        </div>
      </div>
    </div>
  );
}
