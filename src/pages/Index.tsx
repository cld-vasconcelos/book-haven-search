
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import BookGrid from "@/components/BookGrid";

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
  const navigate = useNavigate();

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["books", searchQuery],
    queryFn: () => searchBooks(searchQuery),
    enabled: !!searchQuery,
  });

  const handleBookSelect = (book: Book) => {
    const bookId = book.key.split("/").pop();
    navigate(`/book/${bookId}`);
  };

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
            onBookSelect={handleBookSelect}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
