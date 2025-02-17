
import BookCard from "./BookCard";
import { AnimatePresence, motion } from "framer-motion";

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
}

interface BookGridProps {
  books: Book[];
  onBookSelect: (book: Book) => void;
  isLoading?: boolean;
}

const BookGrid = ({ books, onBookSelect, isLoading }: BookGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="book-card">
            <div className="aspect-[2/3] skeleton" />
            <div className="p-4 space-y-2">
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <AnimatePresence>
        {books.map((book) => (
          <BookCard
            key={book.key}
            title={book.title}
            author={book.author_name?.[0] ?? "Unknown Author"}
            coverUrl={
              book.cover_i
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                : undefined
            }
            onClick={() => onBookSelect(book)}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default BookGrid;
