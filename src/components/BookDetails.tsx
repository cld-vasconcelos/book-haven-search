
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface BookDetailsProps {
  book: {
    title: string;
    author_name?: string[];
    cover_i?: number;
    first_publish_year?: number;
    publisher?: string[];
    language?: string[];
  };
  onClose: () => void;
}

const BookDetails = ({ book, onClose }: BookDetailsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-2xl bg-card rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div className="aspect-[2/3] relative rounded-lg overflow-hidden">
            {book.cover_i ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No cover available</span>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">{book.title}</h2>
            {book.author_name && (
              <p className="text-lg text-muted-foreground">
                by {book.author_name.join(", ")}
              </p>
            )}
            {book.first_publish_year && (
              <p className="text-sm">
                First published: {book.first_publish_year}
              </p>
            )}
            {book.publisher && book.publisher.length > 0 && (
              <div>
                <h3 className="font-medium mb-1">Publishers</h3>
                <p className="text-sm text-muted-foreground">
                  {book.publisher.join(", ")}
                </p>
              </div>
            )}
            {book.language && book.language.length > 0 && (
              <div>
                <h3 className="font-medium mb-1">Languages</h3>
                <p className="text-sm text-muted-foreground">
                  {book.language.join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookDetails;
