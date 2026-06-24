"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function buildHref(searchParams: URLSearchParams, updates: Record<string, string>) {
  const params = new URLSearchParams(searchParams.toString());
  for (const [key, value] of Object.entries(updates)) {
    if (!value || value === "all" || (key === "sort" && value === "match_score")) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }
  if (!updates.page) {
    params.delete("page");
  }
  const qs = params.toString();
  return `/find-jobs${qs ? `?${qs}` : ""}`;
}

export function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentFilter = searchParams.get("filter") || "all";
  const currentSort = searchParams.get("sort") || "match_score";
  const currentSearch = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  const navigate = useCallback(
    (updates: Record<string, string>) => {
      router.push(buildHref(searchParams, updates));
    },
    [router, searchParams],
  );

  const handleFilterChange = (value: string) => {
    navigate({ filter: value });
  };

  const handleSortChange = (value: string) => {
    navigate({ sort: value });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      navigate({ search: searchInput });
    }
  };

  const handleSearchBlur = () => {
    if (searchInput !== currentSearch) {
      navigate({ search: searchInput });
    }
  };

  const handleSearchClear = () => {
    setSearchInput("");
    navigate({ search: "" });
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="relative w-full sm:w-64">
        <input
          type="text"
          placeholder="Filter by company or role..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          onBlur={handleSearchBlur}
          className="w-full bg-surface border border-border rounded-md pl-3 pr-8 py-2 text-sm text-text-primary placeholder-text-muted focus:ring-1 focus:ring-accent focus:border-accent outline-none"
        />
        {searchInput && (
          <button
            onClick={handleSearchClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary text-sm"
          >
            ✕
          </button>
        )}
      </div>
      <select
        value={currentFilter}
        onChange={(e) => handleFilterChange(e.target.value)}
        className="bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary appearance-none focus:ring-1 focus:ring-accent focus:border-accent outline-none cursor-pointer"
      >
        <option value="all">All Matches</option>
        <option value="high">High Match</option>
        <option value="low">Low Match</option>
      </select>
      <select
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
        className="bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary appearance-none focus:ring-1 focus:ring-accent focus:border-accent outline-none cursor-pointer"
      >
        <option value="match_score">Match Score</option>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>
  );
}
