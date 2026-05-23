'use client';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { recipeService } from '@/services/recipeService';
import { useState, useEffect, useMemo } from 'react';

export default function RecipeCard({
  recipe,
  variant = 'default',
  onEdit,
  onDelete,
}: {
  recipe: any;
  variant?: 'default' | 'profile';
  onEdit?: (r: any) => void;
  onDelete?: (r: any) => void;
}) {
  const { language, t, user } = useAppContext();
  const [isFavorite, setIsFavorite] = useState(false);

  // Helper to extract translated data from JSON or fallback to raw value
  const getTranslatedLabel = (val: any) => {
    if (!val) return '';

    // If it's a bilingual object: { es: "...", en: "..." }
    if (typeof val === 'object' && !Array.isArray(val) && (val.es || val.en)) {
      return val[language] || val['es'] || '';
    }

    // If it's a string that looks like JSON
    if (typeof val === 'string' && val.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(val);
        if (parsed.es || parsed.en) {
          return parsed[language] || parsed['es'] || val;
        }
      } catch (e) {}
    }

    // Fallback for legacy values (plain arrays or strings)
    return val;
  };

  useEffect(() => {
    if (user && recipe?.id) {
      checkFavorite();
    }
  }, [user, recipe]);

  const checkFavorite = async () => {
    if (!user || !recipe?.id) return;
    const isFav = await recipeService.isRecipeFavorite(user.id, recipe.id);
    setIsFavorite(isFav);
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return;

    // Optimistic UI update
    const previousState = isFavorite;
    setIsFavorite(!previousState);

    try {
      await recipeService.toggleFavorite(user.id, recipe.id);
    } catch (error) {
      console.error('Favorite Toggle Error:', error);
      setIsFavorite(previousState); // revert on error
    }
  };

  // Determine random rating if not present. Use state and effect to prevent SSR hydration errors
  const [rating, setRating] = useState<string | number>('-');
  const [servings, setServings] = useState<string | number>('-');

  useEffect(() => {
    // Only show a real rating if the recipe has one from actual reviews
    setRating(recipe.rating ? Number(recipe.rating).toFixed(1) : '');
    setServings(recipe.servings || Math.floor(Math.random() * 4) + 1);
  }, [recipe.rating, recipe.servings]);

  // Determinar un parche dinámico para las recetas de Francia con UUIDs cuyo SQL update falló.
  const missingFranceImages: Record<string, string> = {
    '3833bb78-b915-4128-b095-478e1fad5aac': '/recipes/france/macarons.png',
    '66c694cb-9e15-4392-9501-03c3df842548': '/recipes/france/croissants.png',
    '974689dc-9e6e-41ae-a889-5c792d802954': '/recipes/france/souffle_chocolat.png',
    '7fb713ed-b670-4dac-bc49-f3c544745a29': '/recipes/france/crepes_suzette.png',
    'f40a83b6-4492-4149-9ae6-5a55a9d5983c': '/recipes/france/pissaladiere.png',
  };

  let displayImageUrl = recipe?.image_url || 'https://via.placeholder.com/400x300?text=Recipe';
  if (
    recipe &&
    missingFranceImages[recipe.id] &&
    (displayImageUrl.includes('unsplash') || displayImageUrl.includes('placeholder'))
  ) {
    displayImageUrl = missingFranceImages[recipe.id];
  }

  const title = getTranslatedLabel(recipe.title);
  const rawCountry = getTranslatedLabel(recipe.category_country);
  
  // Normalizar el país para que coincida con las claves de i18n (siempre minúsculas y sin acentos para la clave)
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

  return (
    <div className={`recipe-card-m ${variant === 'profile' ? 'rc-profile-variant' : ''}`}>
      <Link
        href={`/recipe/${recipe.id}`}
        prefetch={false}
        className="rc-link-wrapper"
        style={{ textDecoration: 'none', color: 'inherit', flex: 1, display: 'flex' }}
      >
        <div className="rc-img-wrapper">
          <img src={displayImageUrl} alt={title} />
          {/* Boton Favoritos superpuesto a la imagen (click stop propagation para no ir al link) */}
          <button
            className="rc-heart-btn"
            onClick={toggleFavorite}
            title={
              isFavorite
                ? t.detail?.remove_favorite || 'Remove from favorites'
                : t.detail?.add_favorite || 'Add to favorites'
            }
            style={{ color: isFavorite ? '#f97316' : 'inherit' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isFavorite ? 'currentColor' : 'none'}
              stroke={isFavorite ? 'none' : 'currentColor'}
              strokeWidth={2}
              style={{ width: '1.8rem', height: '1.8rem' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </button>
          {/* Badge de país superpuesto para variante Profile */}
          {variant === 'profile' && (
            <div className="rc-country-badge">{countryDisplay ? countryDisplay.toUpperCase() : 'WORLD'}</div>
          )}

          {/* Botones Overlay para Mis Recetas en el Perfil */}
          {variant === 'profile' && (onEdit || onDelete) && (
            <div
              style={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                display: 'flex',
                gap: '0.8rem',
                zIndex: 10,
              }}
            >
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit(recipe);
                  }}
                  style={{
                    background: 'var(--card-bg)',
                    color: 'var(--text-color)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '3.6rem',
                    height: '3.6rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                  }}
                  title="Editar receta"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    style={{ width: '1.6rem', height: '1.6rem' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(recipe);
                  }}
                  style={{
                    background: 'var(--card-bg)',
                    color: '#ef4444',
                    border: 'none',
                    borderRadius: '50%',
                    width: '3.6rem',
                    height: '3.6rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                  }}
                  title="Eliminar receta"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    style={{ width: '1.6rem', height: '1.6rem' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="rc-content">
          {/* El rating y category se ocultan en el perfil */}
          {variant !== 'profile' ? (
            <div className="rc-top-meta">
              <span>{countryDisplay}</span>
              {rating ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ width: '1.4rem', height: '1.4rem' }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {rating}
                </span>
              ) : (
                <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--primary-color)', background: 'rgba(249,115,22,0.12)', padding: '0.2rem 0.8rem', borderRadius: '4px' }}>
                  {(t.card as any)?.new_label || 'New'}
                </span>
              )}
            </div>
          ) : (
            <div className="rc-profile-header">
              <span className="rc-profile-cat">{countryDisplay}</span>
            </div>
          )}

          <h3
            className="rc-title"
            title={title}
            style={{ marginTop: variant === 'profile' ? '0.4rem' : '0' }}
          >
            {title}
          </h3>

          {variant !== 'profile' && (
            <p className="rc-description">
              {getTranslatedLabel(recipe.description) ||
                (language === 'es'
                  ? 'Preparado con los mejores ingredientes locales...'
                  : 'Prepared with the best local ingredients...')}
            </p>
          )}

          <div className="rc-bottom-meta">
            <span className="rc-time-box">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              {recipe.prep_time || '30'} {t.card?.prep_time || 'mins'}
            </span>

            {variant === 'profile' ? (
              <span className={`rc-status-badge ${recipe.is_private ? 'private' : 'public'}`}>
                {recipe.is_private
                  ? (t.profile as any)?.private || 'Private'
                  : (t.profile as any)?.public || 'Public'}
              </span>
            ) : (
              <span className="rc-serv-box">
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
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                {servings} {t.card?.servings || 'servings'}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
