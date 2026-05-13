import { useState, useEffect } from 'react';
import { recipeService } from '@/services/recipeService';
import { useAppContext } from '@/context/AppContext';

export function useRecipes() {
  const { searchTerm, activeCategory } = useAppContext();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeSidebarFilter, setActiveSidebarFilter] = useState('');

  useEffect(() => {
    setPage(1);
  }, [searchTerm, activeCategory, activeSidebarFilter]);

  useEffect(() => {
    const fetchRecipes = async () => {
      // Si no hay categoría seleccionada y no hay término de búsqueda,
      // no mostramos recetas por defecto (según feedback del usuario)
      if (!activeCategory && !searchTerm && !activeSidebarFilter) {
        setRecipes([]);
        setTotalPages(1);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, totalPages } = await recipeService.getRecipes({
        page,
        searchTerm,
        activeCategory,
        activeSidebarFilter,
      });
      setRecipes(data);
      setTotalPages(totalPages);
      setLoading(false);
    };

    fetchRecipes();
  }, [page, searchTerm, activeCategory, activeSidebarFilter]);

  return {
    recipes,
    loading,
    page,
    setPage,
    totalPages,
    activeSidebarFilter,
    setActiveSidebarFilter,
  };
}
