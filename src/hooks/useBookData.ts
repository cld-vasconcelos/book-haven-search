
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface BookDetails {
  title: string;
  authors?: Array<{
    key: string;
    name: string;
  }>;
  covers?: number[];
  first_publish_date?: string;
  description?: {
    value: string;
  };
  subjects?: string[];
}

export const useBookData = (bookId: string) => {
  const { data: book, isLoading: isLoadingBook } = useQuery({
    queryKey: ["book", bookId],
    queryFn: async () => {
      const response = await fetch(`https://openlibrary.org/works/${bookId}.json`);
      if (!response.ok) throw new Error("Failed to fetch book details");
      const data = await response.json();
      
      if (data.authors) {
        const authorPromises = data.authors.map(async (authorRef: { author: { key: string } }) => {
          const authorKey = authorRef.author.key;
          const authorResponse = await fetch(`https://openlibrary.org${authorKey}.json`);
          if (!authorResponse.ok) return null;
          const authorData = await authorResponse.json();
          return {
            key: authorKey,
            name: authorData.name
          };
        });
        
        const authors = await Promise.all(authorPromises);
        data.authors = authors.filter(author => author !== null);
      }
      
      return data as BookDetails;
    },
  });

  const { data: reviews = [], isLoading: isLoadingReviews } = useQuery({
    queryKey: ["reviews", bookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("book_id", bookId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: averageRating = 0 } = useQuery({
    queryKey: ["bookRating", bookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("rating")
        .eq("book_id", bookId);
      
      if (error) throw error;
      
      if (!data || data.length === 0) return 0;
      
      const avgRating = data.reduce((sum, review) => sum + review.rating, 0) / data.length;
      return Math.round(avgRating * 10) / 10;
    },
  });

  return {
    book,
    reviews,
    averageRating,
    isLoadingBook,
    isLoadingReviews,
  };
};
