'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.push('/login');
  }, [router]);

  return null; /* Redirigiendo a /login que ahora tiene la pantalla dividida (Split Screen) */
}
