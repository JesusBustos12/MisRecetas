'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Página de Favoritos (Redirección al Hub de Perfil)
 * Siguiendo la distribución óptima de la referencia: paginaMiPerfil
 */
export default function FavoritesPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/profile?tab=favorites');
  }, [router]);

  return (
    <div
      className="premium-theme"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <span
        className="loading-spinner"
        style={{ width: '4rem', height: '4rem', borderWidth: '4px' }}
      ></span>
    </div>
  );
}
