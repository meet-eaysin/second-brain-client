import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useDatabaseView } from "@/modules/database-view/context";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  placeholder = "Search records...",
  className = "",
}: SearchBarProps) {
  const { searchQuery, onSearchQueryChange, isRecordsLoading } =
    useDatabaseView();

  const handleClear = () => {
    onSearchQueryChange("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      handleClear();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

        <Input
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-10"
          disabled={isRecordsLoading}
        />

        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
            disabled={isRecordsLoading}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {isRecordsLoading && searchQuery && (
        <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}
