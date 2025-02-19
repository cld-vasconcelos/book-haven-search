
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface ReviewFormProps {
  bookId: string;
  onReviewSubmitted: () => void;
}

const ReviewForm = ({ bookId, onReviewSubmitted }: ReviewFormProps) => {
  const [rating, setRating] = useState<number>(0);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: existingReview, isLoading: isCheckingExistingReview } = useQuery({
    queryKey: ["userReview", bookId, user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("reviews")
        .select()
        .eq("book_id", bookId)
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground mb-2">Sign in to leave a review</p>
        <Button onClick={() => navigate("/auth")}>Sign In</Button>
      </div>
    );
  }

  if (isCheckingExistingReview) {
    return <div>Loading...</div>;
  }

  if (existingReview) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">You have already reviewed this book</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("reviews")
        .insert([{ 
          book_id: bookId, 
          rating, 
          text: text.trim() || null,
          user_id: user.id
        }]);

      if (error) throw error;

      toast({
        title: "Review submitted",
        description: "Thank you for your review!",
      });
      setRating(0);
      setText("");
      onReviewSubmitted();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-full p-1"
            >
              <Star
                className={`w-6 h-6 ${
                  value <= rating
                    ? "fill-primary text-primary"
                    : "text-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="review" className="text-sm font-medium">
          Review (optional)
        </label>
        <Textarea
          id="review"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your review..."
          className="min-h-[100px]"
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        Submit Review
      </Button>
    </form>
  );
};

export default ReviewForm;
