import React from "react";
import { Search, CalendarDays, X } from "lucide-react";

const SermonFilters = ({ searchQuery, setSearchQuery, selectedDate, setSelectedDate }) => {
  const hasActiveFilters = Boolean(searchQuery || selectedDate);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDate(null);
  };

  return (
    <div className="px-6 py-8" role="search">
      <div className="flex flex-col max-w-3xl gap-3 p-3 mx-auto bg-white shadow-lg sm:flex-row sm:items-center rounded-2xl sm:rounded-full">
        {/* Search */}
        <div className="flex items-center flex-1 gap-3 px-4 py-2.5 rounded-full bg-[#f0f0f0]">
          <Search size={18} className="text-primary/40 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sermons by title or speaker..."
            aria-label="Search sermons"
            className="w-full text-sm bg-transparent outline-none text-primary placeholder:text-primary/40"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="transition-colors text-primary/30 hover:text-primary"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Date */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#f0f0f0] sm:w-56">
          <CalendarDays size={18} className="text-primary/40 shrink-0" />
          <input
            type="date"
            value={selectedDate || ""}
            onChange={(e) => setSelectedDate(e.target.value || null)}
            aria-label="Filter by date"
            className="w-full text-sm bg-transparent outline-none text-primary [color-scheme:light]"
          />
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="px-5 py-2.5 text-sm font-bold text-white transition-colors rounded-full shrink-0 bg-primary hover:bg-secondary"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default SermonFilters;