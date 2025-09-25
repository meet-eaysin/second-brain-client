import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search,
  Database,
  FileText,
  Clock,
  Loader2,
  Filter,
  X,
} from "lucide-react";
import {
  searchApi,
  type GlobalSearchResult,
  type SearchFilters,
} from "../services/searchApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface GlobalSearchProps {
  placeholder?: string;
  className?: string;
  onResultSelect?: (result: any) => void;
  showFilters?: boolean;
  autoFocus?: boolean;
}

export function GlobalSearch({
  placeholder = "Search databases, records, and more...",
  className,
  onResultSelect,
  showFilters = true,
  autoFocus = false,
}: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GlobalSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const navigate = useNavigate();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
    loadRecentSearches();
  }, [autoFocus]);

  useEffect(() => {
    if (query.trim().length >= 2) {
      // Debounce search
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        performSearch();
      }, 300);
    } else {
      setResults(null);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, filters]);

  const loadRecentSearches = () => {
    const saved = localStorage.getItem("recent-searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to load recent searches:", error);
      }
    }
  };

  const saveRecentSearch = (searchQuery: string) => {
    const updated = [
      searchQuery,
      ...recentSearches.filter((s) => s !== searchQuery),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recent-searches", JSON.stringify(updated));
  };

  const performSearch = async () => {
    if (!query.trim()) return;

    try {
      setIsLoading(true);
      const searchResults = await searchApi.globalSearch(query, filters, {
        limit: 20,
        includeSnippets: true,
        highlightMatches: true,
      });
      setResults(searchResults);
      saveRecentSearch(query);
    } catch (error) {
      console.error("Search failed:", error);
      toast.error("Search failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (
    result: any,
    type: "database" | "record" | "user"
  ) => {
    setIsOpen(false);

    if (onResultSelect) {
      onResultSelect(result);
      return;
    }

    // Default navigation behavior
    switch (type) {
      case "database":
        navigate(`/app/databases/${result.id}`);
        break;
      case "record":
        navigate(`/app/databases/${result.databaseId}?record=${result.id}`);
        break;
      case "user":
        navigate(`/app/users/${result.id}`);
        break;
    }
  };

  const clearFilters = () => {
    setFilters({});
    setShowFilterPanel(false);
  };

  const hasActiveFilters = Object.keys(filters).some(
    (key) =>
      filters[key as keyof SearchFilters] !== undefined &&
      filters[key as keyof SearchFilters] !== ""
  );

  return (
    <div className={`relative ${className}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              placeholder={placeholder}
              className="pl-10 pr-20"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              {showFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilterPanel(!showFilterPanel)}
                  className={`h-6 w-6 p-0 ${
                    hasActiveFilters ? "text-blue-600" : ""
                  }`}
                >
                  <Filter className="h-3 w-3" />
                </Button>
              )}
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-[600px] p-0" align="start">
          <Command>
            <CommandList className="max-h-[400px]">
              {!query.trim() && recentSearches.length > 0 && (
                <CommandGroup heading="Recent Searches">
                  {recentSearches.map((search, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => setQuery(search)}
                      className="flex items-center gap-2"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{search}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {query.trim() && !results && !isLoading && (
                <CommandEmpty>Start typing to search...</CommandEmpty>
              )}

              {isLoading && (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Searching...</span>
                </div>
              )}

              {results && (
                <>
                  {results.databases.length > 0 && (
                    <CommandGroup
                      heading={`Databases (${results.databases.length})`}
                    >
                      {results.databases.slice(0, 5).map((db) => (
                        <CommandItem
                          key={db.id}
                          onSelect={() => handleResultClick(db, "database")}
                          className="flex items-start gap-3 p-3"
                        >
                          <Database className="h-4 w-4 mt-0.5 text-blue-500" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{db.name}</p>
                            {db.description && (
                              <p className="text-sm text-muted-foreground truncate">
                                {db.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {db.recordCount} records
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                by {db.ownerName}
                              </span>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {results.records.length > 0 && (
                    <CommandGroup
                      heading={`Records (${results.records.length})`}
                    >
                      {results.records.slice(0, 5).map((record) => (
                        <CommandItem
                          key={record.id}
                          onSelect={() => handleResultClick(record, "record")}
                          className="flex items-start gap-3 p-3"
                        >
                          <FileText className="h-4 w-4 mt-0.5 text-green-500" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              Record in {record.databaseName}
                            </p>
                            {record.snippet && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {record.snippet}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {record.databaseName}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(
                                  record.updatedAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {results.users.length > 0 && (
                    <CommandGroup heading={`Users (${results.users.length})`}>
                      {results.users.slice(0, 3).map((user) => (
                        <CommandItem
                          key={user.id}
                          onSelect={() => handleResultClick(user, "user")}
                          className="flex items-center gap-3 p-3"
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                            {user.firstName?.[0] || user.username[0]}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">
                              {user.firstName && user.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : user.username}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {results.totalResults === 0 && (
                    <CommandEmpty>No results found for "{query}"</CommandEmpty>
                  )}
                </>
              )}
            </CommandList>
          </Command>

          {results && results.totalResults > 0 && (
            <div className="border-t p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigate(`/app/search?q=${encodeURIComponent(query)}`);
                  setIsOpen(false);
                }}
                className="w-full"
              >
                View all {results.totalResults} results
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Filter Panel */}
      {showFilterPanel && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Type</label>
                <select
                  value={filters.type || "all"}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      type:
                        e.target.value === "all" ? undefined : e.target.value,
                    }))
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                >
                  <option value="all">All</option>
                  <option value="databases">Databases</option>
                  <option value="records">Records</option>
                  <option value="users">Users</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Date Range</label>
                <select
                  value={filters.dateRange ? "custom" : "all"}
                  onChange={(e) => {
                    if (e.target.value === "all") {
                      setFilters((prev) => ({ ...prev, dateRange: undefined }));
                    }
                  }}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                >
                  <option value="all">All time</option>
                  <option value="today">Today</option>
                  <option value="week">This week</option>
                  <option value="month">This month</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear
              </Button>
              <Button size="sm" onClick={() => setShowFilterPanel(false)}>
                Apply
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
