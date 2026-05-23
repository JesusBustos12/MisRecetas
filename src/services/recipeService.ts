import { HERO_RECIPE_IDS, RECIPES_PER_PAGE } from '@/constants';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Helper para parsear campos JSON que vienen como string desde MySQL
 */
const parseRecipeData = (r: any) => {
  if (!r) return r;
  return {
    ...r,
    title:
      typeof r.title === 'string' && (r.title.startsWith('{') || r.title.startsWith('['))
        ? JSON.parse(r.title)
        : r.title,
    description:
      typeof r.description === 'string' &&
      (r.description.startsWith('{') || r.description.startsWith('['))
        ? JSON.parse(r.description)
        : r.description,
    ingredients:
      typeof r.ingredients === 'string' &&
      (r.ingredients.startsWith('[') || r.ingredients.startsWith('{'))
        ? JSON.parse(r.ingredients)
        : r.ingredients,
    steps:
      typeof r.steps === 'string' && (r.steps.startsWith('[') || r.steps.startsWith('{'))
        ? JSON.parse(r.steps)
        : r.steps,
    nutrition:
      typeof r.nutrition === 'string' &&
      (r.nutrition.startsWith('{') || r.nutrition.startsWith('['))
        ? JSON.parse(r.nutrition)
        : r.nutrition,
  };
};

export const recipeService = {
  async getHeroRecipes() {
    try {
      const countries = ['italy', 'mexico', 'japan', 'spain', 'usa', 'france', 'thailand', 'greece', 'india', 'china'];
      const heroRecipes: any[] = [];

      // Traemos una muestra grande de recetas para filtrar
      const response = await fetch(`${API_URL}/recipes?limit=200`);
      const result = await response.json();
      const data = Array.isArray(result) ? result : result.data || [];
      const parsed = data.map(parseRecipeData);

      countries.forEach(country => {
        const countryRecipes = parsed
          .filter((r: any) => {
            const rCountry = (r.category_country || '').toLowerCase();
            return rCountry === country || 
                   (country === 'mexico' && rCountry === 'méxico') ||
                   (country === 'spain' && rCountry === 'españa') ||
                   (country === 'japan' && rCountry === 'japón') ||
                   (country === 'thailand' && rCountry === 'tailandia') ||
                   (country === 'greece' && rCountry === 'grecia');
          })
          .slice(0, 1);
        
        heroRecipes.push(...countryRecipes);
      });

      // Si no llegamos a 10 con los filtros, rellenamos con las más recientes
      if (heroRecipes.length < 10) {
        const existingIds = new Set(heroRecipes.map(r => r.id));
        const additional = parsed.filter((r: any) => !existingIds.has(r.id)).slice(0, 10 - heroRecipes.length);
        heroRecipes.push(...additional);
      }

      // Barajar un poco para que no salgan siempre en el mismo orden de países
      return heroRecipes.sort(() => Math.random() - 0.5);
    } catch (error) {
      console.error('Error fetching hero recipes:', error);
      return [];
    }
  },

  async getRecipes({
    page,
    searchTerm,
    activeCategory,
    activeSidebarFilter,
  }: {
    page: number;
    searchTerm: string;
    activeCategory: string;
    activeSidebarFilter: string;
  }) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: RECIPES_PER_PAGE.toString(),
      });

      if (searchTerm) params.append('search', searchTerm);
      if (activeCategory) params.append('category', activeCategory);
      if (activeSidebarFilter && activeSidebarFilter !== 'all') {
        params.append('type', activeSidebarFilter);
      }

      const response = await fetch(`${API_URL}/recipes?${params.toString()}`);
      const result = await response.json();

      const data = result.data || [];
      const totalPages = result.meta?.totalPages || 1;

      return {
        data: data.map(parseRecipeData),
        totalPages,
      };
    } catch (error) {
      console.error('Error fetching recipes:', error);
      return { data: [], totalPages: 0 };
    }
  },

  async getRecipesByUser(userId: string) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/recipes`);
      if (!response.ok) return [];
      const data = await response.json();
      return data.map(parseRecipeData);
    } catch (error) {
      console.error('Error fetching user recipes:', error);
      return [];
    }
  },

  async getFavoriteRecipes(userId: string) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/favorites`);
      if (!response.ok) return [];
      const data = await response.json();
      return data.map(parseRecipeData);
    } catch (error) {
      console.error('Error fetching favorite recipes:', error);
      return [];
    }
  },

  async createRecipe(recipeData: any) {
    try {
      const token = localStorage.getItem('app_token');
      const response = await fetch(`${API_URL}/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recipeData),
      });
      if (!response.ok) throw new Error('Error creating recipe');
      return await response.json();
    } catch (error) {
      console.error('Error in createRecipe:', error);
      throw error;
    }
  },

  async getRecipeById(id: string) {
    try {
      const response = await fetch(`${API_URL}/recipes/${id}`);
      if (!response.ok) return null;
      const data = await response.json();
      return parseRecipeData(data);
    } catch (error) {
      console.error('Error fetching recipe by id:', error);
      return null;
    }
  },

  async updateRecipe(recipeId: string, recipeData: any) {
    try {
      const token = localStorage.getItem('app_token');
      const response = await fetch(`${API_URL}/recipes/${recipeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recipeData),
      });
      if (!response.ok) throw new Error('Error updating recipe');
      return await response.json();
    } catch (error) {
      console.error('Error in updateRecipe:', error);
      throw error;
    }
  },

  async deleteRecipe(recipeId: string) {
    try {
      const token = localStorage.getItem('app_token');
      const response = await fetch(`${API_URL}/recipes/${recipeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Error deleting recipe');
      return await response.json();
    } catch (error) {
      console.error('Error in deleteRecipe:', error);
      throw error;
    }
  },

  async toggleFavorite(userId: number | string, recipeId: number | string) {
    try {
      const response = await fetch(`${API_URL}/favorites/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, recipe_id: recipeId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  },

  async isRecipeFavorite(userId: number | string, recipeId: number | string) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/favorites`);
      if (!response.ok) return false;
      const favorites = await response.json();
      return favorites.some((f: any) => String(f.id) === String(recipeId));
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  },
};
