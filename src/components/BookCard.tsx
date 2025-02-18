
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface BookCardProps {
  title: string;
  author: string;
  coverUrl?: string;
  onClick: () => void;
  bookId: string;
}

const BookCard = ({ title, author, coverUrl, onClick, bookId }: BookCardProps) => {
  const { data: rating } = useQuery({
    queryKey: ["bookRating", bookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("rating")
        .eq("book_id", bookId);
      
      if (error) throw error;
      
      if (!data || data.length === 0) return 0;
      
      const avgRating = data.reduce((sum, review) => sum + review.rating, 0) / data.length;
      return Math.round(avgRating * 10) / 10; // Round to 1 decimal
    },
  });

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
        <p className="text-sm text-muted-foreground mb-2">{author}</p>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-primary text-primary" />
          <span className="text-sm">
            {rating ? rating : "No ratings"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
