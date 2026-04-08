'use client'

import { useState, useCallback } from "react";
import Image from "next/image";
import LogBookModal from "./LogBookModal";

interface OLBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  number_of_pages_median?: number;
}

export default function BookSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<OLBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedBook, setSelectedBook] = useState<OLBook | null>(null);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=20&fields=key,title,author_name,first_publish_year,cover_i,number_of_pages_median`
      );
      const data = await res.json();
      setResults(data.docs ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    search(query);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. The Midnight Library, Matt Haig..."
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-40 transition-colors"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {loading && (
        <div className="text-sm text-gray-400 text-center py-8">Searching Open Library…</div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="text-sm text-gray-400 text-center py-8">No results found.</div>
      )}

      {!loading && results.length > 0 && (
        <div className="divide-y divide-gray-100">
          {results.map((book) => (
            <div
              key={book.key}
              className="flex gap-4 py-4 items-start"
            >
              {/* Cover */}
              <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                {book.cover_i ? (
                  <Image
                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`}
                    alt={book.title}
                    width={48}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">📚</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm leading-snug">{book.title}</div>
                {book.author_name && (
                  <div className="text-xs text-gray-500 mt-0.5">{book.author_name.slice(0, 2).join(", ")}</div>
                )}
                {book.first_publish_year && (
                  <div className="text-xs text-gray-400 mt-0.5">{book.first_publish_year}</div>
                )}
              </div>

              {/* Action */}
              <button
                onClick={() => setSelectedBook(book)}
                className="text-xs border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-50 transition-colors flex-shrink-0"
              >
                Log book
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedBook && (
        <LogBookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
}
