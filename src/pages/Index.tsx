
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "@/components/SearchBar";
import BookGrid from "@/components/BookGrid";
import BookDetails from "@/components/BookDetails";
import { AnimatePresence } from "framer-motion";

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  publisher?: string[];
  language?: string[];
}

const searchBooks = async (query: string): Promise<Book[]> => {
  const response = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }
  const data = await response.json();
  return data.docs;
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["books", searchQuery],
    queryFn: () => searchBooks(searchQuery),
    enabled: !!searchQuery,
  });

  return (
    <div className="min-h-screen w-full px-4 py-8 space-y-8">
      <div className="max-w-2xl mx-auto text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Book Haven Search</h1>
        <p className="text-lg text-muted-foreground">
          Discover your next favorite book
        </p>
      </div>

      <SearchBar onSearch={setSearchQuery} isLoading={isLoading} />

      <div className="container mx-auto">
        {searchQuery && !isLoading && books.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No books found for "{searchQuery}"
            </p>
          </div>
        ) : (
          <BookGrid
            books={books}
            onBookSelect={setSelectedBook}
            isLoading={isLoading}
          />
        )}
      </div>

      <AnimatePresence>
        {selectedBook && (
          <BookDetails
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
