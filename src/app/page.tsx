import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";

interface TrendingBook {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
}

interface SubjectBook {
  key: string;
  title: string;
  authors?: { name: string }[];
  cover_id?: number;
}

interface Category {
  label: string;
  books: { key: string; title: string; author: string; coverId: number }[];
}

async function fetchTrending() {
  try {
    const res = await fetch("https://openlibrary.org/trending/weekly.json?limit=30", {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    return (data.works ?? [] as TrendingBook[])
      .filter((b: TrendingBook) => b.cover_i)
      .slice(0, 20)
      .map((b: TrendingBook) => ({
        key: b.key,
        title: b.title,
        author: b.author_name?.[0] ?? "",
        coverId: b.cover_i!,
      }));
  } catch {
    return [];
  }
}

async function fetchSubject(subject: string) {
  try {
    const res = await fetch(
      `https://openlibrary.org/subjects/${subject}.json?limit=30`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return (data.works ?? [] as SubjectBook[])
      .filter((b: SubjectBook) => b.cover_id)
      .slice(0, 20)
      .map((b: SubjectBook) => ({
        key: b.key,
        title: b.title,
        author: b.authors?.[0]?.name ?? "",
        coverId: b.cover_id!,
      }));
  } catch {
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  const [trending, fiction, mystery, scifi, romance, biography] = await Promise.all([
    fetchTrending(),
    fetchSubject("popular_fiction"),
    fetchSubject("mystery_and_detective_stories"),
    fetchSubject("science_fiction"),
    fetchSubject("romance"),
    fetchSubject("biography"),
  ]);

  return [
    { label: "Trending this week", books: trending },
    { label: "Fiction", books: fiction },
    { label: "Mystery & Thriller", books: mystery },
    { label: "Sci-Fi & Fantasy", books: scifi },
    { label: "Romance", books: romance },
    { label: "Biography & Memoir", books: biography },
  ].filter((c) => c.books.length > 0);
}

export default async function Home() {
  const categories = await getCategories();

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
          <Link href="/login" className="text-sm" style={{ color: "var(--fg-muted)" }}>
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
      <section className="text-center px-6 pt-16 pb-10">
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

      {/* Category Rows */}
      <section className="flex-1 pb-20 space-y-10">
        {categories.map((category) => (
          <div key={category.label}>
            <div className="px-8 mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold tracking-tight">{category.label}</h2>
              <Link href="/signup" className="text-xs font-medium" style={{ color: "var(--fg-muted)" }}>
                See all →
              </Link>
            </div>

            {/* Scrollable row */}
            <div
              className="flex gap-3 px-8"
              style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
            >
              {category.books.map((book) => (
                <Link
                  key={book.key}
                  href="/signup"
                  className="book-3d relative flex-none rounded overflow-hidden"
                  style={{ width: 100, background: "var(--card-bg)" }}
                  title={`${book.title}${book.author ? " — " + book.author : ""}`}
                >
                  <div className="relative" style={{ width: 100, height: 150 }}>
                    <Image
                      src={`https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`}
                      alt={book.title}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                    <div
                      className="absolute inset-0 flex items-end p-1.5 opacity-0 hover:opacity-100 transition-opacity duration-300"
                      style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)" }}
                    >
                      <span className="text-white text-[9px] font-medium leading-tight line-clamp-3">
                        {book.title}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
