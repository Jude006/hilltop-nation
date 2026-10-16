import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../lib/api';

const GalleryFilters = ({ activeCategory, setActiveCategory }) => {
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiRequest('/media', 'GET', null, false);
        const uniqueCategories = ['All', ...new Set(data.map(g => g.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return null;

  return (
    <div className=" z-20 flex flex-wrap justify-center gap-3 px-4 -mt-8 md:gap-6 top-24">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
            activeCategory === cat
              ? "bg-secondary text-white shadow-lg scale-105"
              : "bg-white text-primary/40 hover:text-secondary shadow-md"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default GalleryFilters;