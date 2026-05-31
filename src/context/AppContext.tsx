'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Translations, translations } from '@/i18n';

type Theme = 'light' | 'dark';
type Language = 'es' | 'en';

interface AppContextProps {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
  user: any;
  userProfile: any;
  setUserProfile: (profile: any) => void;
  login: (userData: any, token?: string) => void;
  logout: () => void;
  t: Translations;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  isAuthLoaded: boolean;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('es');
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  const [searchTerm, setSearchTermState] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [previousCategory, setPreviousCategory] = useState('');

  const setSearchTerm = (rawTerm: string) => {
    const term = rawTerm ? rawTerm.charAt(0).toUpperCase() + rawTerm.slice(1).toLowerCase() : '';
    
    if (term.length > 0 && searchTerm === '') {
      // Al empezar a buscar, guardamos la categoría actual y pasamos a "Todas"
      setPreviousCategory(activeCategory);
      setActiveCategory('Todas');
    } else if (term === '' && searchTerm !== '') {
      // Al borrar la búsqueda, regresamos a la categoría anterior
      setActiveCategory(previousCategory || 'Todas');
    }
    setSearchTermState(term);
  };
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();

  useEffect(() => {
    // Sincronizar activeCategory con la URL (Deep Linking)
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setActiveCategory(categoryParam);
    } else if (pathname === '/') {
      // Si estamos en el home y no hay parámetro, podríamos querer limpiar,
      // pero lo dejamos así para no romper la navegación manual de Sidebar.
    }

    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang === 'es' || savedLang === 'en') {
      setLanguage(savedLang);
    }

    // CARGA SESIÓN LOCAL (MySQL Migration)
    const savedUser = localStorage.getItem('app_user');
    const savedToken = localStorage.getItem('app_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setIsAuthLoaded(true);
  }, []);

  useEffect(() => {
    if (user && user.id) {
      // Obtener perfil usando userService migrado
      import('@/services/userService').then(({ userService }) => {
        userService
          .getUserProfile(user.id)
          .then((data) => {
            if (data) setUserProfile(data);
            else setUserProfile(user);
          })
          .catch((err) => {
            console.warn('Session stale or user missing. Logging out.', err);
            logout(); // Limpiar sesión si el usuario ya no existe en DB
          });
      });
    } else {
      setUserProfile(null);
    }
  }, [user]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleLanguage = () => {
    const newLang = language === 'es' ? 'en' : 'es';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const login = (userData: any, token?: string) => {
    setUser(userData);
    localStorage.setItem('app_user', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('app_token', token);
    }
  };

  const logout = () => {
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem('app_user');
    localStorage.removeItem('app_token');
  };

  const t = translations[language] || translations['es'];

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        language,
        toggleLanguage,
        user,
        userProfile,
        setUserProfile,
        login,
        logout,
        t,
        searchTerm,
        setSearchTerm,
        activeCategory,
        setActiveCategory,
        isAuthLoaded,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
