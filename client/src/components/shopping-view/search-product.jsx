import { Search, X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { clearSearch, searchProducts } from "@/store/search-slice";

function SearchProduct() {
  const dispatch = useDispatch();
  const { keyword, isLoading } = useSelector((state) => state.search);
  const [query, setQuery] = useState(keyword);

  function handleSubmit(event) {
    event.preventDefault();
    const nextQuery = query.trim();

    if (!nextQuery) {
      dispatch(clearSearch());
      return;
    }

    dispatch(searchProducts({ keyword: nextQuery }));
  }

  function handleClear() {
    setQuery("");
    dispatch(clearSearch());
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2" role="search">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search products..."
          aria-label="Search products"
          className="h-10 pl-9 pr-9"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Clear product search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      <Button type="submit" disabled={isLoading || !query.trim()} className="h-10">
        {isLoading ? "Searching..." : "Search"}
      </Button>
    </form>
  );
}

export default SearchProduct;
