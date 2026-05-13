const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const userService = {
  /**
   * Obtiene el perfil de un usuario por su ID desde el backend MySQL
   */
  async getUserProfile(userId: string) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`);
      if (!response.ok) throw new Error('Usuario no encontrado');
      return await response.json();
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      throw error;
    }
  },

  /**
   * Actualiza el perfil público del usuario en MySQL
   */
  async updateProfile(
    userId: string,
    updates: { full_name?: string; avatar_url?: string; email?: string; password?: string },
  ) {
    try {
      const token = localStorage.getItem('app_token');
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Error al actualizar el perfil');
      return await response.json();
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  },

  /**
   * Sube un avatar (usa el mismo endpoint de updateProfile)
   */
  async uploadAvatar(userId: string, base64Image: string) {
    return this.updateProfile(userId, { avatar_url: base64Image });
  },

  /**
   * Toggles a recipe as favorite in MySQL
   */
  async toggleFavorite(userId: string, recipeId: number) {
    try {
      const token = localStorage.getItem('app_token');
      const response = await fetch(`${API_URL}/favorites/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId, recipe_id: recipeId }),
      });
      const data = await response.json();
      return data.favorite;
    } catch (error) {
      console.error('Error in toggleFavorite:', error);
      throw error;
    }
  },

  /**
   * Get all favorite recipe IDs for a user
   */
  async getFavoriteIds(userId: string) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/favorites`);
      if (!response.ok) return [];
      const data = await response.json();
      return data.map((f: any) => f.id);
    } catch (error) {
      console.error('Error in getFavoriteIds:', error);
      return [];
    }
  },
};
