'use client'

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface OLBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
}

interface Props {
  book: OLBook;
  onClose: () => void;
}

const STATUSES = [
  { value: "read", label: "Read" },
  { value: "reading", label: "Currently reading" },
  { value: "want_to_read", label: "Want to read" },
];

export default function LogBookModal({ book, onClose }: Props) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [status, setStatus] = useState("read");
  const [review, setReview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("Not signed in.");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("reading_log").upsert({
      user_id: user.id,
      ol_key: book.key,
      title: book.title,
      author: book.author_name?.slice(0, 2).join(", ") ?? null,
      cover_id: book.cover_i ?? null,
      year: book.first_publish_year ?? null,
      status,
      rating: rating || null,
      review: review.trim() || null,
      logged_at: new Date().toISOString(),
    }, { onConflict: "user_id,ol_key" });

    if (error) {
      setError(error.message);
      setSaving(false);
    } else {
      router.refresh();
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
        {/* Header */}
        <div className="flex gap-4 items-start">
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
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 leading-snug">{book.title}</div>
            {book.author_name && (
              <div className="text-sm text-gray-500 mt-0.5">{book.author_name.slice(0, 2).join(", ")}</div>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Status</label>
          <div className="flex gap-2 flex-wrap">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                onClick={() => setStatus(s.value)}
                className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                  status === s.value
                    ? "bg-gray-900 text-white border-gray-900"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        {status === "read" && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(star === rating ? 0 : star)}
                  className="text-2xl transition-transform hover:scale-110"
                >
                  {star <= (hovered || rating) ? "★" : "☆"}
                </button>
              ))}
              {rating > 0 && (
                <span className="text-sm text-gray-400 ml-2 self-center">{rating}/5</span>
              )}
            </div>
          </div>
        )}

        {/* Review */}
        {status === "read" && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
              Review <span className="normal-case font-normal">(optional)</span>
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={3}
              placeholder="What did you think?"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            />
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-sm px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-40 transition-colors"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
