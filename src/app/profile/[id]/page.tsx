'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { userService } from '@/services/userService';
import { recipeService } from '@/services/recipeService';
import { useAppContext } from '@/context/AppContext';
import RecipeCard from '@/components/RecipeCard';
import ProfileHeader from '@/components/profile/ProfileHeader';

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { t, user: currentUser } = useAppContext();

  const [profile, setProfile] = useState<any>(null);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // If it's the current user, redirect to main profile
      if (currentUser && currentUser.id === id) {
        router.push('/profile');
        return;
      }
      fetchData();
    }
  }, [id, currentUser]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const prof = await userService.getUserProfile(id);
      setProfile(prof);

      const recs = await recipeService.getRecipesByUser(id);
      // Only show public recipes on a public profile
      setRecipes(recs.filter((r: any) => !r.is_private));
    } catch (error) {
      console.error('Error fetching public profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="premium-theme"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <span className="loading-spinner" style={{ width: '4rem', height: '4rem' }}></span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="premium-theme" style={{ padding: '8rem', textAlign: 'center' }}>
        <h1>User Not Found</h1>
        <button
          className="btn btn-primary"
          onClick={() => router.push('/')}
          style={{ marginTop: '2rem' }}
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="premium-theme">
      <main className="main-content" style={{ paddingBottom: '8rem' }}>
        <div className="profile-master-card" style={{ marginBottom: '4rem' }}>
          <div className="pmc-left">
            <div className="pmc-avatar-box">
              <img
                src={profile.avatar_url || 'https://via.placeholder.com/150'}
                alt={profile.full_name}
              />
            </div>
            <div className="pmc-info">
              <h1 className="pmc-name">{profile.full_name}</h1>
              <div className="pmc-meta">
                <span className="pmc-role">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12L3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                    />
                  </svg>
                  Cocinero de RecipeWorld
                </span>
                <span className="pmc-dot">•</span>
                <span
                  className="pmc-recipe-count"
                  style={{ color: 'var(--primary-color)', fontWeight: 700 }}
                >
                  {recipes.length} {t.profile?.recipes_created || 'Recipes Created'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-tab-header">
          <h2>{profile.full_name}'s Recipes</h2>
          <span className="profile-tab-sort">VIEWING PUBLIC CONTENT</span>
        </div>

        <div className="recipe-grid" style={{ marginTop: '2rem' }}>
          {recipes.length > 0 ? (
            recipes.map((r) => <RecipeCard key={r.id} recipe={r} variant="profile" />)
          ) : (
            <p
              style={{
                gridColumn: '1/-1',
                textAlign: 'center',
                fontSize: '1.6rem',
                color: 'var(--text-muted)',
              }}
            >
              This user hasn't published any public recipes yet.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
