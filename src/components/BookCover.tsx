
interface BookCoverProps {
  coverUrl?: string;
  title: string;
}

const BookCover = ({ coverUrl, title }: BookCoverProps) => {
  return (
    <div className="aspect-[2/3] relative rounded-lg overflow-hidden">
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <span className="text-muted-foreground">No cover available</span>
        </div>
      )}
    </div>
  );
};

export default BookCover;
