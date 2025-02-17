
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  initialValue?: string;
}

const SearchBar = ({ onSearch, isLoading, initialValue = "" }: SearchBarProps) => {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for books..."
          className="w-full px-4 py-3 pl-12 rounded-full border border-border bg-card/50 backdrop-blur-sm 
                   transition-all duration-300 outline-none focus:ring-2 focus:ring-primary/20
                   placeholder:text-muted-foreground text-base"
          disabled={isLoading}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
      </div>
    </form>
  );
};

export default SearchBar;
