
import { motion } from "framer-motion";

interface BookCardProps {
  title: string;
  author: string;
  coverUrl?: string;
  onClick: () => void;
}

const BookCard = ({ title, author, coverUrl, onClick }: BookCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="book-card cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-[2/3] relative overflow-hidden rounded-t-lg">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No cover</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-base line-clamp-2 mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{author}</p>
      </div>
    </motion.div>
  );
};

export default BookCard;
