import React, { useEffect, useState, useMemo } from "react";
import { SearchX } from "lucide-react";
import { apiRequest } from "../../lib/api";
import { toast } from "react-toastify";
import SermonCard from "./SermonCard";

const SermonGrid = ({ searchQuery, selectedDate }) => {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        const data = await apiRequest("/sermons", "GET", null, false);
        setSermons(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching sermons:", err);
        toast.error("Could not load sermons");
      } finally {
        setLoading(false);
      }
    };
    fetchSermons();
  }, []);

  const filteredSermons = useMemo(() => {
    let result = [...sermons];

    if (searchQuery?.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (s) =>
          s.title?.toLowerCase().includes(q) ||
          s.speaker?.toLowerCase().includes(q) ||
          s.desc?.toLowerCase().includes(q)
      );
    }

    if (selectedDate) {
      result = result.filter(
        (s) => s.date && new Date(s.date).toISOString().slice(0, 10) === selectedDate
      );
    }

    return result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [sermons, searchQuery, selectedDate]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="overflow-hidden bg-white rounded-3xl animate-pulse">
            <div className="bg-black/10 aspect-video" />
            <div className="p-6 space-y-3 sm:p-7">
              <div className="w-3/4 h-6 rounded bg-black/10" />
              <div className="w-1/2 h-4 rounded bg-black/10" />
              <div className="w-1/3 h-4 rounded bg-black/10" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredSermons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <SearchX size={40} className="mb-4 text-primary/20" />
        <p className="text-lg font-bold text-primary/60">No sermons found</p>
        <p className="mt-1 text-sm text-primary/40">Try adjusting your search or date filter.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {filteredSermons.map((sermon, index) => (
        <SermonCard key={sermon._id} sermon={sermon} index={index} />
      ))}
    </div>
  );
};

export default SermonGrid;