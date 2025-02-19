
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

interface BookHeaderProps {
  title: string;
  authors?: Array<{
    key: string;
    name: string;
  }>;
  averageRating: number;
  reviewCount: number;
}

const BookHeader = ({ title, authors, averageRating, reviewCount }: BookHeaderProps) => {
  const getAuthorId = (authorKey: string) => {
    if (!authorKey) return '';
    return authorKey.includes('/') ? authorKey.split('/').pop() : authorKey;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <div className="space-y-1">
        {authors?.map((author) => (
          <div key={author.key}>
            <Link
              to={`/author/${getAuthorId(author.key)}`}
              className="text-lg text-primary hover:underline"
            >
              {author.name}
            </Link>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-4">
        <Star className="w-6 h-6 fill-primary text-primary" />
        <span className="text-lg font-semibold">
          {averageRating ? `${averageRating} / 5` : "No ratings yet"}
        </span>
        <span className="text-muted-foreground">
          ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
        </span>
      </div>
    </div>
  );
};

export default BookHeader;
