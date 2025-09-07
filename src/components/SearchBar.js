"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export const SearchBar = ({
  onSearch,
  onClear,
  placeholder = "Search...",
  value = "",
}) => {
  const [searchValue, setSearchValue] = useState(value);

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchValue.trim());
  };

  const handleClear = () => {
    setSearchValue("");
    onClear();
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);

    // Auto-search as user types (debounced)
    if (newValue.trim() === "") {
      onClear();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10"
        />
        {searchValue && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
};
