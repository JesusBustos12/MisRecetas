'use client';
import { useAppContext } from '@/context/AppContext';
import { recipeService } from '@/services/recipeService';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const {
    theme,
    toggleTheme,
    language,
    toggleLanguage,
    user,
    userProfile,
    t,
    logout,
    searchTerm,
    setSearchTerm,
    isAuthLoaded,
    setActiveCategory,
  } = useAppContext();
  const fallbackT = t || {
    search_placeholder: 'Search recipes...',
    my_recipes: 'My Recipes',
    favorites: 'Favorites',
    logout: 'Logout',
    login: 'Login',
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Al escribir en el buscador, si estamos en el home, hacemos scroll a las recetas
    if (searchTerm && searchTerm.trim().length > 0) {
      if (pathname === '/') {
        const recipesSection = document.getElementById('recipes-grid-section');
        if (recipesSection) {
          recipesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        // Si no estamos en el home, redirigimos al home con el término de búsqueda
        router.push('/');
      }
    }
  }, [searchTerm]);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    router.push('/login');
  };

  return (
    <nav className="header">
      <div className="navbar-left">
        <Link
          href="/"
          className="navbar-logo"
          onClick={() => {
            setActiveCategory('');
            setSearchTerm('');
          }}
        >
          <img
            src="/Imgs/gorro-de-cocinero.png"
            alt="Chef Hat"
            style={{ width: '5.2rem', height: '5.2rem', objectFit: 'contain' }}
          />
          <span style={{ fontSize: '3.0rem', fontWeight: 'bold' }}>GlobalRecipes</span>
        </Link>

        <div className="theme-switch-wrapper">
          <div
            className="theme-slider"
            onClick={toggleTheme}
            title={
              theme === 'dark'
                ? t.nav?.theme_light || 'Modo Claro'
                : t.nav?.theme_dark || 'Modo Oscuro'
            }
          >
            <div className="slider-icons">
              <span>☀️</span>
              <span>🌙</span>
            </div>
            <div className="slider-thumb">{theme === 'dark' ? '🌙' : '☀️'}</div>
          </div>
        </div>
        <button
          onClick={toggleLanguage}
          className="icon-btn-round"
          title="Language"
          style={{ width: '3.6rem', height: '3.6rem', fontSize: '1.2rem', fontWeight: 600 }}
        >
          {language === 'es' ? 'EN' : 'ES'}
        </button>
      </div>

      <div className="navbar-right">
        {!pathname.startsWith('/profile') && (
          <div className="navbar-search-mockup" ref={searchWrapperRef}>
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
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              type="text"
              placeholder={fallbackT.nav?.search_placeholder || 'Buscar recetas...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {user ? (
          <div className="user-menu-container" ref={menuRef}>
            <div className="user-avatar-nav" onClick={() => setMenuOpen(!menuOpen)}>
              {userProfile?.avatar_url ? (
                <img
                  src={userProfile.avatar_url}
                  alt="User"
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ fontSize: '1.8rem' }}>🧑‍🍳</span>
              )}
            </div>

            {menuOpen && (
              <div className="user-dropdown">
                <Link href="/profile" onClick={() => setMenuOpen(false)}>
                  {fallbackT.nav?.my_profile || 'Mi Perfil'}
                </Link>
                <Link href="/favorites" onClick={() => setMenuOpen(false)}>
                  {fallbackT.nav?.favorites || 'Favoritos'}
                </Link>
                <button onClick={handleLogout} style={{ color: '#ef4444' }}>
                  {fallbackT.nav?.logout || 'Cerrar Sesión'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className="btn btn-primary" style={{ padding: '0.8rem 2.4rem' }}>
            {fallbackT.nav?.login || 'Entrar'}
          </Link>
        )}
      </div>
    </nav>
  );
}
