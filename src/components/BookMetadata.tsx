
interface BookMetadataProps {
  publishDate?: string;
  description?: string | { value: string };
  subjects?: string[];
}

const BookMetadata = ({ publishDate, description, subjects }: BookMetadataProps) => {
  return (
    <div className="space-y-6">
      {publishDate && (
        <p className="text-muted-foreground">
          First published: {publishDate}
        </p>
      )}

      {description && (
        <div>
          <h2 className="text-xl font-semibold mb-2">About this book</h2>
          <p className="text-muted-foreground leading-relaxed">
            {typeof description === 'string'
              ? description
              : description.value}
          </p>
        </div>
      )}

      {subjects && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Subjects</h2>
          <div className="flex flex-wrap gap-2">
            {subjects.slice(0, 10).map((subject) => (
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
  );
};

export default BookMetadata;
