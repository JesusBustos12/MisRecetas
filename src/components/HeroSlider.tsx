'use client';
import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { recipeService } from '@/services/recipeService';
import Link from 'next/link';

export default function HeroSlider() {
  const { t, language } = useAppContext();
  const [heroRecipes, setHeroRecipes] = useState<any[]>([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    const fetchHero = async () => {
      const data = await recipeService.getHeroRecipes();
      setHeroRecipes(data);
    };
    fetchHero();
  }, []);

  useEffect(() => {
    if (heroRecipes.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroRecipes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroRecipes]);

  const getHeroBadge = (country: string) => {
    const countryKey = country.toLowerCase().replace('méxico', 'mexico').replace('españa', 'spain').replace('japón', 'japan').replace('tailandia', 'thailand');
    const countryName = t.countries?.[countryKey] || country;
    
    if (language === 'es') {
      const badges: Record<string, string> = {
        mexico: '🇲🇽 ESENCIA DE MÉXICO',
        italy: '🇮🇹 TRADICIÓN ITALIANA',
        japan: '🇯🇵 MAESTRÍA JAPONESA',
        spain: '🇪🇸 SABOR ESPAÑOL',
        usa: '🇺🇸 CLÁSICO AMERICANO',
        france: '🇫🇷 ELEGANCIA FRANCESA',
        greece: '🇬🇷 MEDITERRÁNEO PURO',
        thailand: '🇹🇭 EXOTISMO TAILANDÉS',
        india: '🇮🇳 AROMA DE LA INDIA',
        china: '🇨🇳 TRADICIÓN MILENARIA',
      };
      return badges[countryKey] || '⭐ RECETA DESTACADA';
    } else {
      const badges: Record<string, string> = {
        mexico: '🇲🇽 MEXICAN ESSENCE',
        italy: '🇮🇹 ITALIAN TRADITION',
        japan: '🇯🇵 JAPANESE MASTERY',
        spain: '🇪🇸 SPANISH FLAVOR',
        usa: '🇺🇸 AMERICAN CLASSIC',
        france: '🇫🇷 FRENCH ELEGANCE',
        greece: '🇬🇷 PURE MEDITERRANEAN',
        thailand: '🇹🇭 THAI EXOTICISM',
        india: '🇮🇳 AROMA OF INDIA',
        china: '🇨🇳 MILLENARY TRADITION',
      };
      return badges[countryKey] || '⭐ FEATURED RECIPE';
    }
  };

  if (heroRecipes.length === 0) {
    return (
      <section className="hero-section">
        <div className="hero-skeleton">
          <div className="skeleton-text skeleton-title"></div>
          <div className="skeleton-text skeleton-subtitle"></div>
          <div className="skeleton-text skeleton-btn"></div>
        </div>
      </section>
    );
  }

  const currentHero = heroRecipes[currentHeroIndex];

  return (
    <section className="hero-section">
      <div key={currentHero.id} className="hero-slide animate-fade-in">
        <img
          src={
            currentHero.image_url ||
            'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&h=600&fit=crop'
          }
          alt={currentHero.title?.[language] || 'Recipe'}
          className="hero-bg"
          loading="lazy"
        />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span className="hero-badge">{getHeroBadge(currentHero.category_country)}</span>
          </div>
          <h1 className="hero-title">{currentHero.title?.[language] || currentHero.title?.en || 'Recipe Title'}</h1>
          <p className="hero-subtitle">
            {currentHero.description?.[language] ||
              currentHero.description?.en ||
              (language === 'es'
                ? 'Explora esta deliciosa receta tradicional.'
                : 'Explore this delicious traditional recipe.')}
          </p>
          <div className="hero-actions">
            <Link
              href={`/recipe/${currentHero.id}`}
              prefetch={false}
              className="btn btn-primary"
              style={{
                borderRadius: '2rem',
                padding: '1.2rem 2.4rem',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              {t.hero?.view_recipe || (language === 'es' ? 'Ver Receta' : 'View Recipe')} &rarr;
            </Link>
            <div className="hero-time">
              <span>⏱</span> {currentHero.prep_time || 45} mins
            </div>
          </div>
        </div>
      </div>
      <div className="hero-dots">
        {heroRecipes.map((_, idx) => (
          <div
            key={idx}
            className={`hero-dot ${idx === currentHeroIndex ? 'active' : ''}`}
            onClick={() => setCurrentHeroIndex(idx)}
          ></div>
        ))}
      </div>
    </section>
  );
}
