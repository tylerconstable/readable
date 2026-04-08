import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";

interface OLBook {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
}

async function getTrendingBooks(): Promise<OLBook[]> {
  try {
    const res = await fetch(
      "https://openlibrary.org/trending/weekly.json?limit=60",
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return (data.works ?? []).filter((b: OLBook) => b.cover_i).slice(0, 48);
  } catch {
    return [];
  }
}

export default async function Home() {
  const books = await getTrendingBooks();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--fg)" }}>
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-8 py-5 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <span className="text-xl font-bold tracking-tight">Readable</span>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-sm"
            style={{ color: "var(--fg-muted)" }}
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm px-4 py-2 rounded-full font-medium transition-colors"
            style={{ background: "var(--fg)", color: "var(--bg)" }}
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 pt-20 pb-12">
        <h1 className="text-5xl font-bold tracking-tight max-w-2xl mx-auto leading-tight">
          Track every book you&apos;ve ever read.
        </h1>
        <p className="mt-5 text-lg max-w-lg mx-auto" style={{ color: "var(--fg-muted)" }}>
          Rate books, keep a reading log, build AI-powered lists, and see what your friends are reading.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/signup"
            className="px-6 py-3 rounded-full text-sm font-medium transition-colors"
            style={{ background: "var(--fg)", color: "var(--bg)" }}
          >
            Start for free
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-full text-sm font-medium border transition-colors"
            style={{ borderColor: "var(--border)", color: "var(--fg)" }}
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* 3D Book Grid */}
      <section className="flex-1 px-6 pb-16">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
          {books.map((book) => (
            <Link
              key={book.key}
              href="/signup"
              className="book-3d relative rounded overflow-hidden"
              style={{ background: "var(--card-bg)" }}
              title={`${book.title}${book.author_name ? " by " + book.author_name[0] : ""}`}
            >
              <div className="aspect-[2/3] relative">
                <Image
                  src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 25vw, (max-width: 768px) 17vw, (max-width: 1024px) 12vw, 9vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-all duration-300 flex items-end p-2 opacity-0 hover:opacity-100">
                  <span className="text-white text-[10px] font-medium leading-tight line-clamp-2">
                    {book.title}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
