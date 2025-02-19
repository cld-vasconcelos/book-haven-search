
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Add this import
import { supabase } from "@/integrations/supabase/client"; // Add this import
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
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("q") || "";
  });
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["books", searchQuery],
    queryFn: () => searchBooks(searchQuery),
    enabled: !!searchQuery,
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (searchQuery) {
      params.set("q", searchQuery);
    } else {
      params.delete("q");
    }
    navigate(`?${params.toString()}`, { replace: true });
  }, [searchQuery, navigate, location.search]);

  const handleBookSelect = (book: Book) => {
    const bookId = book.key.split("/").pop();
    navigate(`/book/${bookId}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen w-full px-4 py-8 space-y-8">
      <div className="flex justify-end px-4">
        {user ? (
          <Button variant="outline" onClick={() => supabase.auth.signOut()}>
            Sign Out
          </Button>
        ) : (
          <Button onClick={() => navigate("/auth")}>Sign In</Button>
        )}
      </div>

      <div className="max-w-2xl mx-auto text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Book Haven Search</h1>
        <p className="text-lg text-muted-foreground">
          Discover your next favorite book
        </p>
      </div>

      <SearchBar onSearch={handleSearch} isLoading={isLoading} initialValue={searchQuery} />

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
