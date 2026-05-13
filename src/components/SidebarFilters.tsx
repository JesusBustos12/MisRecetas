'use client';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

interface SidebarFiltersProps {
  activeSidebarFilter: string;
  setActiveSidebarFilter: (filter: string) => void;
}

export default function SidebarFilters({
  activeSidebarFilter,
  setActiveSidebarFilter,
}: SidebarFiltersProps) {
  const { t, setActiveCategory } = useAppContext();

  const handleFilterClick = (type: string) => {
    setActiveSidebarFilter(type);
    // Clear country category so sidebar filters become global as requested
    setActiveCategory('');
  };

  return (
    <aside className="sidebar">
      <div>
        <h3 className="sidebar-title">{t.home?.recipe_type || 'RECIPE TYPE'}</h3>
        <ul className="sidebar-menu">
          {Object.entries(
            t.home?.filters || {
              all: 'All Recipes',
              vegetarian: 'Vegetarian',
              meat: 'Meat',
              seafood: 'Seafood',
              desserts: 'Desserts',
            },
          ).map(([type, label]) => (
            <li key={type}>
              <button
                className={`sidebar-btn ${activeSidebarFilter === type ? 'active' : ''}`}
                onClick={() => handleFilterClick(type)}
              >
                {type === 'all' && <span>🍽️</span>}
                {type === 'vegetarian' && <span>🍃</span>}
                {type === 'meat' && <span>🥩</span>}
                {type === 'seafood' && <span>🐟</span>}
                {type === 'desserts' && <span>🍰</span>}
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="share-widget">
        <h3>{t.home?.share_title || 'Share your creation!'}</h3>
        <p>
          {t.home?.share_desc || 'Upload your own recipes and join our global cooking community.'}
        </p>
        <Link href="/create-recipe" className="btn btn-primary" style={{ borderRadius: '2rem' }}>
          {t.home?.submit_recipe || 'Submit Recipe'}
        </Link>
      </div>
    </aside>
  );
}
