import React from 'react';
import { Book } from '../types';
import { Link } from 'react-router-dom';
import { Book as BookIcon } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { volumeInfo } = book;
  const thumbnail = volumeInfo.imageLinks?.thumbnail;

  return (
    <Link to={`/book/${book.id}`} className="group">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        <div className="aspect-[2/3] relative">
          {thumbnail ? (
            <img
              src={thumbnail.replace('http:', 'https:')}
              alt={volumeInfo.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <BookIcon size={48} className="text-gray-400 dark:text-gray-500" />
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg line-clamp-2 mb-2 text-gray-900 dark:text-white">{volumeInfo.title}</h3>
          {volumeInfo.authors && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              By {volumeInfo.authors.join(', ')}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};