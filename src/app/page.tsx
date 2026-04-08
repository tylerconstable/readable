import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <span className="text-xl font-bold tracking-tight">Readable</span>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 max-w-2xl leading-tight">
          Track every book you&apos;ve ever read.
        </h1>
        <p className="mt-6 text-xl text-gray-500 max-w-lg">
          Rate books, keep a reading log, build lists, and see what your friends are reading.
        </p>
        <div className="mt-10 flex gap-4">
          <Link
            href="/signup"
            className="bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Start for free
          </Link>
          <Link
            href="/login"
            className="border border-gray-200 text-gray-700 px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </main>
    </div>
  );
}
