'use client';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { use } from 'react';
import { userService } from '@/services/userService';
import { recipeService } from '@/services/recipeService';
import EditRecipeModal from '@/components/profile/EditRecipeModal';
import Toast from '@/components/Toast';

export default function RecipeDetailClient({ id }: { id: string }) {
  const { language, user, t, setActiveCategory, setSearchTerm } = useAppContext();
  const router = useRouter();

  // Helper to extract translated data from JSON or fallback to raw value
  const getTranslatedLabel = (val: any) => {
    if (!val) return '';

    // If it's a bilingual object: { es: "...", en: "..." }
    if (typeof val === 'object' && !Array.isArray(val) && ('es' in val || 'en' in val)) {
      return val[language] || val['es'] || val['en'] || '';
    }

    // If it's a string that looks like JSON
    if (typeof val === 'string' && val.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(val);
        if ('es' in parsed || 'en' in parsed) {
          return parsed[language] || parsed['es'] || parsed['en'] || '';
        }
      } catch (e) {}
    }

    // Fallback for legacy values (plain arrays or strings)
    return typeof val === 'object' ? JSON.stringify(val) : val;
  };

  const [recipe, setRecipe] = useState<any>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [ratingHover, setRatingHover] = useState(0);
  const [ratingSelect, setRatingSelect] = useState(0);

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

  const [submittingReview, setSubmittingReview] = useState(false);
  const [activeTab, setActiveTab] = useState('Ingredients');
  const [isFavorite, setIsFavorite] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [recommendedRecipes, setRecommendedRecipes] = useState<any[]>([]);

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  useEffect(() => {
    fetchRecipeData();
  }, [id]);

  const fetchRecipeData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      let country = '';
      // Fetch Recipe
      const recResp = await fetch(`${API_URL}/recipes/${id}`);
      if (recResp.ok) {
        const recData = await recResp.json();
        setRecipe(recData);
        if (recData && recData.category_country) {
          country = recData.category_country;
        }
      }

      // Fetch Comments
      const comResp = await fetch(`${API_URL}/recipes/${id}/comments`);
      if (comResp.ok) {
        const comData = await comResp.json();
        setComments(comData);
      }

      // Check favorite status
      if (user) {
        const favIds = await userService.getFavoriteIds(user.id);
        setIsFavorite(favIds.includes(Number(id)));
      }

      // Fetch recommended recipes (same country) using already fetched country info
      if (country) {
        const recs = await recipeService.getRecipes({
          page: 1,
          searchTerm: '',
          activeCategory: country,
          activeSidebarFilter: 'all',
        });
        if (recs && recs.data) {
          const filtered = recs.data.filter((r: any) => String(r.id) !== String(id)).slice(0, 2);
          setRecommendedRecipes(filtered);
        }
      }
    } catch (error) {
      console.error('Error fetching recipe data:', error);
    }
    setLoading(false);
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!newComment.trim() || ratingSelect === 0) return;

    setSubmittingReview(true);
    try {
      const token = localStorage.getItem('app_token');
      const url = editingCommentId 
        ? `${API_URL}/comments/${editingCommentId}` 
        : `${API_URL}/recipes/${id}/comments`;
      const method = editingCommentId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          content: newComment,
          rating: ratingSelect,
        }),
      });

      if (response.ok) {
        setNewComment('');
        setRatingSelect(0);
        setEditingCommentId(null);
        fetchRecipeData(true);
        showToast(editingCommentId ? 'Comentario actualizado' : 'Comentario publicado', 'success');
      } else {
        showToast('Error al guardar el comentario', 'error');
      }
    } catch (error) {
      console.error('Review Error:', error);
      showToast('Ocurrió un error inesperado', 'error');
    }
    setSubmittingReview(false);
  };

  const startEditingComment = (com: any) => {
    setEditingCommentId(com.id);
    setNewComment(com.content);
    setRatingSelect(com.rating || 5);
    // Scroll to the review form
    document.querySelector('.rd-review-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const cancelEditingComment = () => {
    setEditingCommentId(null);
    setNewComment('');
    setRatingSelect(0);
  };

  const toggleFavorite = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      const newState = await userService.toggleFavorite(user.id, Number(id));
      setIsFavorite(newState);
    } catch (error) {
      console.error('Toggle Favorite Error:', error);
    }
  };

  const handleReply = async (commentId: number) => {
    if (!user || !replyContent.trim()) return;
    setIsSubmittingReply(true);
    try {
      const token = localStorage.getItem('app_token');
      await fetch(`${API_URL}/recipes/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          content: `[REPLY to ${commentId}]: ${replyContent}`,
          rating: 5, // Default for creator replies
        }),
      });
      setReplyContent('');
      setReplyingTo(null);
      fetchRecipeData();
    } catch (error) {
      console.error('Reply Error:', error);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleDeleteRecipe = async () => {
    setIsDeleting(true);
    try {
      await recipeService.deleteRecipe(id);
      showToast('Receta eliminada correctamente', 'success');
      router.push('/profile?tab=my_recipes');
    } catch (error) {
      showToast('No se pudo eliminar la receta', 'error');
    } finally {
      setIsDeleting(false);
      setIsDeleteConfirmOpen(false);
    }
  };

  const handleViewAllCountry = () => {
    const countryEn =
      recipe.category_country && typeof recipe.category_country === 'object'
        ? recipe.category_country.en || recipe.category_country.es
        : recipe.category_country;

    setActiveCategory(countryEn);
    router.push('/');
  };

  if (loading) {
    return (
      <div
        className="app-container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <span
          className="loading-spinner"
          style={{
            borderColor: 'rgba(0,0,0,0.1)',
            borderTopColor: 'var(--primary-color)',
            width: '5rem',
            height: '5rem',
            borderWidth: '4px',
          }}
        ></span>
      </div>
    );
  }

  if (!recipe)
    return (
      <div className="app-container" style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>{t.recipe?.not_found || 'Receta no encontrada'}</h2>
      </div>
    );

  const title = getTranslatedLabel(recipe.title);
  const description = getTranslatedLabel(recipe.description);
  const rawCountry = getTranslatedLabel(recipe.category_country);
  
  // Normalizar el país para que coincida con las claves de i18n
  const countryKey = rawCountry.toLowerCase()
    .replace('méxico', 'mexico')
    .replace('españa', 'spain')
    .replace('ee.uu.', 'usa')
    .replace('francia', 'france')
    .replace('italia', 'italy')
    .replace('japón', 'japan')
    .replace('tailandia', 'thailand')
    .replace('grecia', 'greece')
    .replace('india', 'india')
    .replace('china', 'china');

  const countryDisplay = t.countries?.[countryKey] || rawCountry || t.common?.world || 'World';

  const authorName =
    recipe.author_name ||
    recipe.user_name ||
    recipe.users_profiles?.full_name ||
    t.recipe?.anonymous ||
    'Anonymous Chef';
  const authorImg =
    recipe.author_avatar ||
    recipe.user_avatar ||
    recipe.users_profiles?.avatar_url ||
    'https://via.placeholder.com/150';

  const servings = getTranslatedLabel(recipe.servings) || '4';
  const cookTime = getTranslatedLabel(recipe.cook_time) || '30 mins';
  const prepTime = getTranslatedLabel(recipe.prep_time) || '20 mins';

  // Helper: parse a value that could be a JSON string (array or object), a plain array, or a plain string
  const parseJsonField = (val: any): any => {
    if (!val) return val;
    if (typeof val === 'string') {
      try {
        return JSON.parse(val);
      } catch (e) {}
    }
    return val;
  };

  // Parse ingredients
  const parsedIngredients = parseJsonField(recipe.ingredients);
  const rawIngArray = Array.isArray(parsedIngredients)
    ? parsedIngredients
    : typeof parsedIngredients === 'string'
      ? parsedIngredients.split('\n').filter((i) => i.trim())
      : [];
  const ingredientsList = rawIngArray.map((ing: any) => getTranslatedLabel(ing));

  // Parse steps
  const parsedSteps = parseJsonField(recipe.steps);
  const rawStepArray = Array.isArray(parsedSteps)
    ? parsedSteps
    : typeof parsedSteps === 'string'
      ? parsedSteps.split('\n').filter((s) => s.trim())
      : [];
  const stepsList = rawStepArray.map((step: any) => getTranslatedLabel(step));

  // Parse nutrition
  const parsedNutrition = parseJsonField(recipe.nutrition);
  const nutritionObj = (typeof parsedNutrition === 'object' && !Array.isArray(parsedNutrition))
    ? parsedNutrition
    : null;

  const countryEn =
    recipe.category_country && typeof recipe.category_country === 'object'
      ? recipe.category_country.en || recipe.category_country.es
      : recipe.category_country;

  const ratedComments = comments.filter(
    (c: any) => c.rating !== undefined && c.rating !== null && Number(c.rating) > 0,
  );
  const avgRatingRaw =
    ratedComments.length > 0
      ? ratedComments.reduce((acc: number, c: any) => acc + Number(c.rating), 0) /
        ratedComments.length
      : 0;
  const avgRating = avgRatingRaw > 0 ? avgRatingRaw.toFixed(1) : '0.0';
  const roundedRating = Math.round(avgRatingRaw);

  const hasUserCommented = user && comments.some((c: any) => c.user_id === user.id);

  let displayImageUrl =
    recipe?.image_url ||
    'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&h=600&fit=crop';

  return (
    <div className="app-container">
      <main className="main-content recipe-page-container">
        {/* BREADCRUMB */}
        <nav className="rd-breadcrumb">
          <Link
            href="/"
            onClick={() => {
              setActiveCategory('');
              setSearchTerm('');
            }}
          >
            {t.common?.recipes || 'Recipes'}
          </Link>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
          <Link href={`/?category=${countryEn}`}>
            {countryDisplay}
          </Link>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
          <span className="rd-breadcrumb-current">{title}</span>
        </nav>

        {/* TOP GRID (Hero & Info) */}
        <div className="rd-top-grid">
          {/* LEFT TOP: Hero & Stats */}
          <div className="rd-hero-col">
            <div className="rd-hero-img-box">

              <img src={displayImageUrl} alt={title} className="rd-hero-img" />
            </div>

            <div className="rd-stats-grid">
              <div className="rd-stat-box">
                <svg
                  className="rd-stat-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  style={{ width: '2.4rem', height: '2.4rem' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <span className="rd-stat-label">{t.recipe?.prep_time_label || 'PREP TIME'}</span>
                <span className="rd-stat-value">{prepTime}</span>
              </div>
              <div className="rd-stat-box">
                <svg
                  className="rd-stat-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  style={{ width: '2.4rem', height: '2.4rem' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.866 8.21 8.21 0 0 0 3 2.48Z"
                  />
                </svg>
                <span className="rd-stat-label">{t.recipe?.cook_time_label || 'COOK TIME'}</span>
                <span className="rd-stat-value">{cookTime}</span>
              </div>
              <div className="rd-stat-box">
                <svg
                  className="rd-stat-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  style={{ width: '2.4rem', height: '2.4rem' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>
                <span className="rd-stat-label">{t.recipe?.servings_label || 'SERVINGS'}</span>
                <span className="rd-stat-value">{servings}</span>
              </div>
            </div>
          </div>

          {/* RIGHT TOP: Info & Actions */}
          <div className="rd-info-col">
            <h1 className="rd-main-title">{title}</h1>

            <div className="rd-meta-row">
              <div className="rd-author-meta">
                <div className="rd-author-img-wrapper">
                  <img src={authorImg} alt={authorName} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="rd-author-label">{t.recipe?.recipe_by || 'RECIPE BY'}</span>
                  <Link href={`/profile/${recipe.user_id}`} className="rd-author-link">
                    {authorName}
                  </Link>
                </div>
              </div>
            </div>

            <div className="rd-actions-row">
              <button
                className={`rd-btn-primary ${isFavorite ? 'active' : ''}`}
                onClick={toggleFavorite}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={isFavorite ? 'currentColor' : 'none'}
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  style={{ width: '2.4rem', height: '2.4rem' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
                {isFavorite
                  ? t.recipe?.remove_favorite || 'Remove from Favorites'
                  : t.recipe?.add_favorite || 'Save Recipe'}
              </button>
            </div>

            {user && user.id === recipe.user_id && (
              <div className="rd-actions-row" style={{ marginTop: '-1.6rem' }}>
                <button
                  className="rd-btn-icon"
                  onClick={() => setIsEditModalOpen(true)}
                  style={{ width: 'auto', flex: 1, gap: '0.8rem', padding: '0 1.6rem' }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    style={{ width: '2rem', height: '2rem' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                  </svg>
                  {t.common?.edit || 'Edit'}
                </button>
                <button
                  className="rd-btn-icon"
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  style={{
                    width: 'auto',
                    flex: 1,
                    gap: '0.8rem',
                    padding: '0 1.6rem',
                    color: '#ef4444',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    style={{ width: '2rem', height: '2rem' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                  {t.common?.delete || 'Delete'}
                </button>
              </div>
            )}

            <div className="rd-description-box">
              <p>"{description || t.recipe?.no_description || 'No description available.'}"</p>
            </div>

            <div className="rd-rating-meta">
              <div className="rd-rating-content">
                <div className="rd-rating-info">
                  <span className="rd-rating-number">{avgRating}</span>
                  <span className="rd-rating-text">
                    ({comments.length} {t.recipe?.reviews_count || 'reviews'})
                  </span>
                </div>
                <div className="rd-stars-container">
                  <span className="rd-stars-label">
                    {t.recipe?.user_rating_label || 'User Rating'}
                  </span>
                  <div className="rd-stars">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span
                        key={i}
                        className={i <= roundedRating ? '' : 'empty'}
                        style={{ cursor: 'default' }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM GRID (Tabs & Sidebar) */}
        <div className="rd-bottom-grid">
          {/* LEFT BOTTOM: Tabs and Reviews */}
          <div className="rd-content-col">
            <div className="rd-tabs-header">
              <button
                className={`rd-tab-btn ${activeTab === 'Ingredients' ? 'active' : ''}`}
                onClick={() => setActiveTab('Ingredients')}
              >
                {t.recipe?.tab_ingredients || 'Ingredients'}
              </button>
              <button
                className={`rd-tab-btn ${activeTab === 'Preparation' ? 'active' : ''}`}
                onClick={() => setActiveTab('Preparation')}
              >
                {t.recipe?.tab_preparation || 'Preparation'}
              </button>
              <button
                className={`rd-tab-btn ${activeTab === 'Nutrition' ? 'active' : ''}`}
                onClick={() => setActiveTab('Nutrition')}
              >
                {t.recipe?.tab_nutrition || 'Nutrition'}
              </button>
            </div>

            {activeTab === 'Ingredients' && (
              <div className="rd-tab-section">
                <h3>{t.recipe?.full_ingredients || 'Recipe Ingredients'}</h3>
                <ul className="rd-ingredients-list">
                  {ingredientsList.length > 0 ? (
                    ingredientsList.map((ing, idx) => (
                      <li key={idx}>
                        <svg
                          className="rd-check-icon"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          style={{ width: '2.4rem', height: '2.4rem' }}
                        >
                          <path
                            fillRule="evenodd"
                            d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 0 1 1.04-.208Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span style={{ fontSize: '1.6rem', lineHeight: '1.5' }}>{ing}</span>
                      </li>
                    ))
                  ) : (
                    <li>
                      <span style={{ fontSize: '1.6rem', color: 'var(--text-muted)' }}>
                        {t.recipe?.no_ingredients || 'No ingredients listed.'}
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {activeTab === 'Preparation' && (
              <div className="rd-tab-section">
                <h3>{t.recipe?.step_by_step || 'Step-by-Step Instructions'}</h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3.2rem',
                    marginTop: '2.4rem',
                  }}
                >
                  {stepsList.length > 0 ? (
                    stepsList.map((step: string, idx: number) => (
                      <div
                        key={idx}
                        style={{ display: 'flex', gap: '2.4rem', alignItems: 'flex-start' }}
                      >
                        <span
                          style={{
                            minWidth: '4rem',
                            height: '4rem',
                            backgroundColor: 'var(--primary-color)',
                            color: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '1.8rem',
                            fontWeight: 800,
                            flexShrink: 0,
                            marginTop: '0.4rem',
                            boxShadow: '0 4px 6px -1px rgba(234, 112, 21, 0.4)',
                          }}
                        >
                          {idx + 1}
                        </span>
                        <p
                          style={{
                            fontSize: '1.6rem',
                            color: 'var(--text-color)',
                            lineHeight: 1.8,
                            margin: 0,
                          }}
                        >
                          {step}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '1.6rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                      {t.recipe?.no_instructions || 'No instructions provided yet.'}
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'Nutrition' && (
              <div className="rd-tab-section">
                <h3>{t.recipe?.tab_nutrition || 'Nutritional Information'}</h3>
                {nutritionObj && typeof nutritionObj === 'object' && !('es' in nutritionObj && 'en' in nutritionObj) ? (
                  <div className="rd-nutrition-grid">
                    {Object.entries(nutritionObj).map(([key, value]) => (
                      <div key={key} className="rd-nutrition-item">
                        <span className="rd-nutrition-val">{getTranslatedLabel(value)}</span>
                        <span className="rd-nutrition-label">{getTranslatedLabel(key)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '1.6rem', color: 'var(--text-muted)' }}>
                    {t.recipe?.no_nutrition ||
                      'Nutritional information is not available for this recipe.'}
                  </p>
                )}
              </div>
            )}

            {/* REVIEWS SECTION */}
            <div className="rd-reviews-section">
              <h2 className="rd-reviews-title">
                {t.recipe?.reviews_title || 'Community Reviews'}
                <span>({comments.length})</span>
              </h2>

              {hasUserCommented && !editingCommentId ? (
                <div
                  style={{
                    padding: '2.4rem',
                    background: 'linear-gradient(145deg, var(--secondary-color), transparent)',
                    borderRadius: '1.6rem',
                    border: '1px solid rgba(234, 112, 21, 0.2)',
                    textAlign: 'center',
                    marginBottom: '3.2rem',
                  }}
                >
                  <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-color)' }}>
                    {t.recipe?.already_rated ||
                      'You have already rated this recipe. Thanks for your opinion!'}
                  </p>
                </div>
              ) : (
                <form className="rd-review-form" onSubmit={handleAddReview}>
                  <h3>{editingCommentId ? 'Editar tu reseña' : (t.recipe?.leave_review || 'What did you think about this recipe?')}</h3>
                  <div className="rd-rate-row">
                    <span className="rd-rate-row-text">
                      {t.recipe?.rate_this || 'Your rating:'}
                    </span>
                    <div className="rd-rate-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={star <= (ratingHover || ratingSelect) ? 'active' : ''}
                          onClick={() => setRatingSelect(star)}
                          onMouseEnter={() => setRatingHover(star)}
                          onMouseLeave={() => setRatingHover(0)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <textarea
                    className="rd-review-input"
                    placeholder={
                      t.recipe?.review_placeholder ||
                      'Share your experience, modifications to the recipe...'
                    }
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.2rem', gap: '1.2rem' }}>
                    {editingCommentId && (
                      <button
                        className="rd-btn-outline"
                        type="button"
                        onClick={cancelEditingComment}
                        style={{
                          padding: '1.2rem 2.4rem',
                          flex: 'none',
                          width: 'auto',
                          borderRadius: '999px',
                        }}
                      >
                        {t.common?.cancel || 'Cancelar'}
                      </button>
                    )}
                    <button
                      className="rd-btn-primary"
                      type="submit"
                      disabled={!user || submittingReview}
                      style={{
                        padding: '1.2rem 2.4rem',
                        flex: 'none',
                        width: 'auto',
                        borderRadius: '999px',
                      }}
                    >
                      {editingCommentId ? (t.common?.save || 'Guardar Cambios') : (t.recipe?.post_review || 'Post Review')}
                    </button>
                  </div>
                  {!user && (
                    <p
                      style={{
                        color: '#ef4444',
                        fontSize: '1.3rem',
                        marginTop: '1.2rem',
                        textAlign: 'right',
                      }}
                    >
                      {t.recipe?.must_login_review ||
                        'You must be logged in to post a review.'}
                    </p>
                  )}
                </form>
              )}

              <div className="rd-comment-list">
                {comments.length > 0 ? (
                  comments.map((com) => {
                    const canReply = user && user.id === recipe.user_id;
                    return (
                      <div key={com.id} className="rd-comment-item">
                        <div className="rd-comment-avatar">
                          <img
                            src={
                              com.user_avatar ||
                              com.author_avatar ||
                              com.users_profiles?.avatar_url ||
                              'https://via.placeholder.com/40'
                            }
                            alt={com.user_name || com.author_name || com.users_profiles?.full_name}
                          />
                        </div>
                        <div className="rd-comment-body">
                          <div className="rd-comment-header">
                            <div>
                              <span className="rd-comment-name">
                                {com.user_name ||
                                  com.author_name ||
                                  com.users_profiles?.full_name ||
                                  'Chef Anónimo'}
                              </span>
                              <div className="rd-comment-stars">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <span
                                    key={s}
                                    style={{
                                      color: s <= (com.rating || 5) ? '#fbbf24' : '#e5e7eb',
                                    }}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                              <span className="rd-comment-date">
                                {new Date(com.created_at).toLocaleDateString()}
                              </span>
                              {user && user.id === com.user_id && (
                                <button
                                  onClick={() => startEditingComment(com)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--primary-color)',
                                    cursor: 'pointer',
                                    padding: '0.4rem',
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}
                                  title="Editar reseña"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '1.8rem', height: '1.8rem'}}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="rd-comment-text">{com.content}</p>

                          {com.reply && (
                            <div className="rd-comment-reply">
                              <div className="rd-comment-reply-box">
                                <div className="rd-reply-avatar">
                                  <img src={authorImg} alt={authorName} />
                                </div>
                                <div>
                                  <div className="rd-reply-name">
                                    {authorName}{' '}
                                    <span className="rd-reply-badge">
                                      {t.recipe?.author_reply || 'AUTOR'}
                                    </span>
                                  </div>
                                  <p className="rd-reply-text">{com.reply}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {canReply && !com.reply && (
                            <div className="reply-controls" style={{ marginTop: '1.6rem' }}>
                              {replyingTo === com.id ? (
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.8rem',
                                  }}
                                >
                                  <textarea
                                    className="rd-review-input"
                                    style={{ minHeight: '80px', marginBottom: '0' }}
                                    placeholder={
                                      t.recipe?.reply_placeholder ||
                                      'Escribe tu respuesta como autor...'
                                    }
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                  />
                                  <div
                                    style={{
                                      display: 'flex',
                                      gap: '0.8rem',
                                      alignSelf: 'flex-end',
                                    }}
                                  >
                                    <button
                                      className="rd-btn-icon"
                                      onClick={() => setReplyingTo(null)}
                                      style={{
                                        width: 'auto',
                                        padding: '0 1.6rem',
                                        height: '4rem',
                                        fontSize: '1.4rem',
                                      }}
                                    >
                                      {t.common?.cancel || 'Cancelar'}
                                    </button>
                                    <button
                                      className="rd-btn-primary"
                                      onClick={() => handleReply(com.id)}
                                      disabled={isSubmittingReply}
                                      style={{
                                        width: 'auto',
                                        padding: '0 1.6rem',
                                        height: '4rem',
                                        fontSize: '1.4rem',
                                        borderRadius: '1.2rem',
                                      }}
                                    >
                                      {isSubmittingReply ? '...' : t.common?.send || 'Responder'}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setReplyingTo(com.id)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--primary-color)',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    fontSize: '1.3rem',
                                    padding: 0,
                                  }}
                                >
                                  {t.recipe?.reply_btn || 'Responder como Autor'}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p
                    style={{
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      fontSize: '1.6rem',
                      padding: '4rem',
                    }}
                  >
                    {t.recipe?.no_comments || 'Todavía no hay reseñas. ¡Anímate a ser el primero!'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT BOTTOM: Sidebar */}
          <div className="rd-sidebar-col">
            <div className="rd-sidebar-sticky">
              <div className="rd-sidebar-widget">
                <h3 className="rd-widget-title">
                  {t.recipe?.chefs_recommendations || 'Recomendaciones del Chef'}
                </h3>
                <div className="rd-rec-list">
                  {recommendedRecipes.length > 0 ? (
                    recommendedRecipes.map((rec) => {
                      const recTitle =
                        typeof rec.title === 'object' ? rec.title.es || rec.title.en : rec.title;
                      return (
                        <Link href={`/recipe/${rec.id}`} prefetch={false} key={rec.id} className="rd-rec-item">
                          <div className="rd-rec-img-box">
                            <img
                              src={rec.image_url || 'https://via.placeholder.com/100'}
                              className="rd-rec-img"
                              alt={recTitle}
                            />
                          </div>
                          <div>
                            <h4 className="rd-rec-title">{recTitle}</h4>
                            <p className="rd-rec-desc">{rec.category_type || 'Receta'}</p>
                          </div>
                        </Link>
                      );
                    })
                  ) : (
                    <p style={{ fontSize: '1.3rem', color: 'var(--text-muted)' }}>
                      Cargando recomendaciones...
                    </p>
                  )}
                </div>
                <button onClick={handleViewAllCountry} className="rd-btn-outline">
                  {t.home?.view_all || 'Ver Todo'} {countryDisplay}
                </button>
              </div>

              <div className="rd-gear-widget">
                <h3 className="rd-widget-title">
                  {t.recipe?.kitchen_gear || 'Utensilios Recomendados'}
                </h3>
                <div className="rd-gear-grid">
                  <div className="rd-gear-item">
                    <svg
                      className="rd-gear-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      style={{ width: '2.4rem', height: '2.4rem' }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                      />
                    </svg>
                    <span className="rd-gear-cat">{t.recipe?.essential || 'ESENCIAL'}</span>
                    <span className="rd-gear-name">Sartén Grande</span>
                  </div>
                  <div className="rd-gear-item">
                    <svg
                      className="rd-gear-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      style={{ width: '2.4rem', height: '2.4rem' }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                      />
                    </svg>
                    <span className="rd-gear-cat">{t.recipe?.nice_to_have || 'OPCIONAL'}</span>
                    <span className="rd-gear-name">Licuadora</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODALS */}
      {isEditModalOpen && (
        <EditRecipeModal
          recipe={recipe}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => fetchRecipeData()}
          t={t.profile || {}}
        />
      )}

      {isDeleteConfirmOpen && (
        <div className="modal-overlay" onClick={() => setIsDeleteConfirmOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '400px', textAlign: 'center' }}
          >
            <h2 className="modal-title" style={{ color: '#ef4444' }}>
              {t.common?.confirm_delete || t.recipe?.confirm_delete || '¿Eliminar Receta?'}
            </h2>
            <p style={{ margin: '2rem 0', fontSize: '1.6rem', color: 'var(--text-muted)' }}>
              {t.common?.delete_warning || t.recipe?.delete_warning ||
                'Esta acción no se puede deshacer. Todos los datos de la receta se perderán.'}
            </p>
            <div style={{ display: 'flex', gap: '1.2rem' }}>
              <button
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                {t.common?.cancel || t.recipe?.cancel || 'Cancelar'}
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 1, backgroundColor: '#ef4444' }}
                onClick={handleDeleteRecipe}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <span className="loading-spinner"></span>
                ) : (
                  t.common?.delete_btn || 'Eliminar Ahora'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
