'use client';
import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import RecipeCard from '@/components/RecipeCard';
import { userService } from '@/services/userService';
import { recipeService } from '@/services/recipeService';

export default function UserProfile() {
  const { id } = useParams() as { id: string };
  const [profile, setProfile] = useState<any>(null);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Info profile
      const userData = await userService.getUserProfile(id);
      if (userData) {
        setProfile(userData);
      }

      // Recipes
      const recipesData = await recipeService.getRecipesByUser(id);
      if (recipesData) {
        setRecipes(recipesData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="app-container">
        <main className="main-content" style={{ textAlign: 'center', paddingTop: '5rem' }}>
          <span className="loading-spinner"></span>
        </main>
      </div>
    );

  if (!profile)
    return (
      <div className="app-container">
        <main className="main-content">
          <h1 style={{ color: 'var(--text-color)' }}>Usuario no encontrado</h1>
        </main>
      </div>
    );

  return (
    <div className="app-container">
      <main className="main-content">
        <div
          className="card"
          style={{ display: 'flex', alignItems: 'center', gap: '2.4rem', marginBottom: '4rem' }}
        >
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '3.6rem',
                fontWeight: 'bold',
              }}
            >
              {profile.full_name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 style={{ fontSize: '3.2rem', color: 'var(--text-color)', marginBottom: '0.5rem' }}>
              {profile.full_name}
            </h1>
            <p className="text-muted">
              Miembro desde {new Date(profile.created_at || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>

        <h2 style={{ fontSize: '2.4rem', color: 'var(--primary-color)', marginBottom: '2.4rem' }}>
          Recetas de {profile.full_name.split(' ')[0]} ({recipes.length})
        </h2>

        {recipes.length === 0 ? (
          <p className="text-muted" style={{ fontSize: '1.6rem' }}>
            Este usuario aún no ha publicado recetas.
          </p>
        ) : (
          <div className="gallery">
            {recipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
