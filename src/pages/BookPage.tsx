
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

interface BookDetails {
  title: string;
  authors?: Array<{
    author: {
      key: string;
    };
  }>;
  covers?: number[];
  first_publish_date?: string;
  description?: {
    value: string;
  };
  subjects?: string[];
}

const BookPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const { data: book, isLoading } = useQuery({
    queryKey: ["book", bookId],
    queryFn: async () => {
      const response = await fetch(`https://openlibrary.org/works/${bookId}.json`);
      if (!response.ok) throw new Error("Failed to fetch book details");
      const data = await response.json();
      
      // Fetch author details for each author
      if (data.authors) {
        const authorPromises = data.authors.map(async (authorRef: { author: { key: string } }) => {
          const authorKey = authorRef.author.key.split('/').pop();
          const authorResponse = await fetch(`https://openlibrary.org${authorRef.author.key}.json`);
          if (!authorResponse.ok) return null;
          const authorData = await authorResponse.json();
          return {
            key: authorRef.author.key,
            name: authorData.name
          };
        });
        
        const authors = await Promise.all(authorPromises);
        data.authors = authors.filter(author => author !== null);
      }
      
      return data as BookDetails;
    },
  });

  if (isLoading) {
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

  const getAuthorId = (authorKey: string) => {
    if (!authorKey) return '';
    return authorKey.includes('/') ? authorKey.split('/').pop() : authorKey;
  };

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
          <div className="aspect-[2/3] relative rounded-lg overflow-hidden">
            {book.covers?.[0] ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No cover available</span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
              <div className="space-y-1">
                {book.authors?.map((author) => (
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
            </div>

            {book.first_publish_date && (
              <p className="text-muted-foreground">
                First published: {book.first_publish_date}
              </p>
            )}

            {book.description && (
              <div>
                <h2 className="text-xl font-semibold mb-2">About this book</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {typeof book.description === 'string'
                    ? book.description
                    : book.description.value}
                </p>
              </div>
            )}

            {book.subjects && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Subjects</h2>
                <div className="flex flex-wrap gap-2">
                  {book.subjects.slice(0, 10).map((subject) => (
                    <span
                      key={subject}
                      className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookPage;
