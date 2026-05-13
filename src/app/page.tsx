'use client';
import HeroSlider from '@/components/HeroSlider';
import CountryBrowser from '@/components/CountryBrowser';
import SidebarFilters from '@/components/SidebarFilters';
import RecipeGrid from '@/components/RecipeGrid';
import { useRecipes } from '@/hooks/useRecipes';

export default function Home() {
  const {
    recipes,
    loading,
    page,
    setPage,
    totalPages,
    activeSidebarFilter,
    setActiveSidebarFilter,
  } = useRecipes();

  return (
    <div className="app-container">
      <main className="main-content">
        <HeroSlider />
        <CountryBrowser />

        <div className="home-layout" id="recipes-grid-section">
          <SidebarFilters
            activeSidebarFilter={activeSidebarFilter}
            setActiveSidebarFilter={setActiveSidebarFilter}
          />

          <RecipeGrid
            recipes={recipes}
            loading={loading}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </div>
      </main>
    </div>
  );
}
