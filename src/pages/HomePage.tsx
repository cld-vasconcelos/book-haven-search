import React, { useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { BookCard } from '../components/BookCard';
import { searchBooks } from '../services/api';
import { Book } from '../types';
import { Library } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (query: string) => {
    setLoading(true);
    const results = await searchBooks(query);
    setBooks(results);
    setLoading(false);
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <Library className="mx-auto mb-4 text-gray-800 dark:text-gray-200" size={48} />
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Book Explorer</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Discover your next favorite book</p>
          <SearchBar onSearch={handleSearch} />
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          </div>
        ) : (
          <>
            {searched && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
            {searched && books.length === 0 && (
              <div className="text-center text-gray-600 dark:text-gray-400 mt-8">
                No books found. Try a different search term.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};