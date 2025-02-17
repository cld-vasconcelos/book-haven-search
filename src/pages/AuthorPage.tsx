
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

interface AuthorDetails {
  name: string;
  birth_date?: string;
  death_date?: string;
  bio?: {
    value: string;
  };
  photos?: number[];
}

interface AuthorWorks {
  entries: Array<{
    key: string;
    title: string;
    covers?: number[];
    first_publish_date?: string;
  }>;
}

const AuthorPage = () => {
  const { authorId } = useParams();
  const navigate = useNavigate();

  const { data: author, isLoading: authorLoading } = useQuery({
    queryKey: ["author", authorId],
    queryFn: async () => {
      const response = await fetch(`https://openlibrary.org/authors/${authorId}.json`);
      if (!response.ok) throw new Error("Failed to fetch author details");
      return response.json() as Promise<AuthorDetails>;
    },
  });

  const { data: works, isLoading: worksLoading } = useQuery({
    queryKey: ["author-works", authorId],
    queryFn: async () => {
      const response = await fetch(`https://openlibrary.org/authors/${authorId}/works.json`);
      if (!response.ok) throw new Error("Failed to fetch author works");
      return response.json() as Promise<AuthorWorks>;
    },
  });

  if (authorLoading || worksLoading) {
    return (
      <div className="container mx-auto p-6 animate-pulse">
        <div className="max-w-4xl mx-auto">
          <div className="skeleton h-8 w-1/2 mb-4" />
          <div className="skeleton h-6 w-1/3 mb-8" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="aspect-square skeleton rounded-lg" />
            <div className="md:col-span-2 space-y-4">
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-4 w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!author || !works) return null;

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

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="aspect-square relative rounded-lg overflow-hidden">
            {author.photos?.[0] ? (
              <img
                src={`https://covers.openlibrary.org/a/id/${author.photos[0]}-L.jpg`}
                alt={author.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No photo available</span>
              </div>
            )}
          </div>

          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{author.name}</h1>
              {author.birth_date && (
                <p className="text-muted-foreground">
                  {author.birth_date} - {author.death_date || "Present"}
                </p>
              )}
            </div>

            {author.bio && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Biography</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {typeof author.bio === 'string' ? author.bio : author.bio.value}
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Books by {author.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {works.entries.map((work) => (
              <Link
                key={work.key}
                to={`/book/${work.key.split('/').pop()}`}
                className="book-card"
              >
                <div className="aspect-[2/3] relative overflow-hidden rounded-t-lg">
                  {work.covers?.[0] ? (
                    <img
                      src={`https://covers.openlibrary.org/b/id/${work.covers[0]}-M.jpg`}
                      alt={work.title}
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
                  <h3 className="font-semibold text-base line-clamp-2 mb-1">
                    {work.title}
                  </h3>
                  {work.first_publish_date && (
                    <p className="text-sm text-muted-foreground">
                      {work.first_publish_date}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthorPage;
