'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

const publicPaths = ['/login', '/register'];

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthLoaded } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Si la autenticación aún no se ha cargado, esperamos
    if (!isAuthLoaded) return;

    // Redirigir a login si el usuario no está autenticado y la ruta no es pública
    if (!user && !publicPaths.includes(pathname)) {
      setAuthorized(false);
      router.push('/login');
    } 
    // Redirigir a la página principal si el usuario está autenticado y la ruta es login o register
    else if (user && publicPaths.includes(pathname)) {
      setAuthorized(false);
      router.push('/');
    } 
    // En cualquier otro caso, autorizar el acceso
    else {
      setAuthorized(true);
    }
  }, [user, isAuthLoaded, pathname, router]);

  // Mostrar un indicador de carga o simplemente nada mientras se determina la autorización
  if (!isAuthLoaded || !authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg-primary)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  return <>{children}</>;
}
