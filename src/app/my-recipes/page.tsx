'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MyRecipesRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.push('/profile?tab=my_recipes');
  }, [router]);

  return null; /* Redirigiendo al Hub Principal del Perfil */
}
