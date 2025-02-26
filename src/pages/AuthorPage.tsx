import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuthorBooks } from '../services/api';
import { Book } from '../types';
import { BookCard } from '../components/BookCard';
import { ArrowLeft, User } from 'lucide-react';

export const AuthorPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthorBooks = async () => {
      if (name) {
        const results = await getAuthorBooks(name);
        setBooks(results);
        setLoading(false);
      }
    };
    fetchAuthorBooks();
  }, [name]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full">
              <User size={32} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{decodeURIComponent(name)}</h1>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Books by this author</h2>
        
        {books.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 dark:text-gray-400 py-12">
            No books found for this author.
          </div>
        )}
      </div>
    </div>
  );
};