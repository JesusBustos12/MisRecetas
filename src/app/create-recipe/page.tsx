'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateRecipeRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.push('/profile?tab=create');
  }, [router]);

  return null; /* Redirigiendo al Hub Principal del Perfil */
}
