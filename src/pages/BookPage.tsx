
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";
import BookCover from "@/components/BookCover";
import BookHeader from "@/components/BookHeader";
import BookMetadata from "@/components/BookMetadata";
import { useBookData } from "@/hooks/useBookData";

const BookPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    book,
    reviews,
    averageRating,
    isLoadingBook,
    isLoadingReviews,
  } = useBookData(bookId!);

  const handleReviewSubmitted = () => {
    queryClient.invalidateQueries({ queryKey: ["reviews", bookId] });
    queryClient.invalidateQueries({ queryKey: ["bookRating", bookId] });
  };

  if (isLoadingBook) {
    return (
      <div className="container mx-auto p-6 animate-pulse">
        <div className="max-w-4xl mx-auto">
          <div className="skeleton h-8 w-3/4 mb-4" />
          <div className="skeleton h-6 w-1/2 mb-8" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-[2/3] skeleton rounded-lg" />
            <div className="space-y-4">
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-4 w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto p-6"
    >
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          <BookCover
            coverUrl={book.covers?.[0] ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg` : undefined}
            title={book.title}
          />

          <div className="space-y-6">
            <BookHeader
              title={book.title}
              authors={book.authors}
              averageRating={averageRating}
              reviewCount={reviews.length}
            />

            <BookMetadata
              publishDate={book.first_publish_date}
              description={book.description}
              subjects={book.subjects}
            />
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>
          <div className="space-y-8">
            <ReviewForm bookId={bookId!} onReviewSubmitted={handleReviewSubmitted} />
            {isLoadingReviews ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ) : (
              <ReviewList reviews={reviews} />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookPage;
