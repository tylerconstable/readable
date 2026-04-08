import BookSearch from "@/components/BookSearch";

export default function SearchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find a book</h1>
        <p className="mt-1 text-sm text-gray-500">Search by title, author, or ISBN</p>
      </div>
      <BookSearch />
    </div>
  );
}
