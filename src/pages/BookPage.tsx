import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBookById } from '../services/api';
import { Book } from '../types';
import { ArrowLeft, Book as BookIcon } from 'lucide-react';

export const BookPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      if (id) {
        const result = await getBookById(id);
        setBook(result);
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">Book not found</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
        >
          Return to search
        </button>
      </div>
    );
  }

  const { volumeInfo } = book;

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

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 p-8">
              {volumeInfo.imageLinks?.thumbnail ? (
                <img
                  src={volumeInfo.imageLinks.thumbnail.replace('http:', 'https:')}
                  alt={volumeInfo.title}
                  className="w-full rounded-lg shadow-md"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <BookIcon size={64} className="text-gray-400 dark:text-gray-500" />
                </div>
              )}
            </div>

            <div className="md:w-2/3 p-8">
              <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{volumeInfo.title}</h1>
              
              {volumeInfo.authors && (
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Authors:</h2>
                  <div className="flex flex-wrap gap-2">
                    {volumeInfo.authors.map((author) => (
                      <Link
                        key={author}
                        to={`/author/${encodeURIComponent(author)}`}
                        className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                      >
                        {author}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {volumeInfo.description && (
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Description:</h2>
                  <p className="text-gray-700 dark:text-gray-300">{volumeInfo.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mt-6">
                {volumeInfo.publishedDate && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Published Date</h3>
                    <p className="text-gray-700 dark:text-gray-300">{volumeInfo.publishedDate}</p>
                  </div>
                )}
                {volumeInfo.publisher && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Publisher</h3>
                    <p className="text-gray-700 dark:text-gray-300">{volumeInfo.publisher}</p>
                  </div>
                )}
                {volumeInfo.pageCount && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Pages</h3>
                    <p className="text-gray-700 dark:text-gray-300">{volumeInfo.pageCount}</p>
                  </div>
                )}
                {volumeInfo.categories && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Categories</h3>
                    <p className="text-gray-700 dark:text-gray-300">{volumeInfo.categories.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};