'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="app-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        textAlign: 'center',
        gap: '2rem',
      }}
    >
      <div style={{ fontSize: '6rem' }}>🍳</div>
      <h1 style={{ fontSize: '3.2rem', color: 'var(--text-dark)' }}>
        ¡Vaya! Algo salió mal en la cocina
      </h1>
      <p style={{ fontSize: '1.8rem', color: 'var(--text-muted)', maxWidth: '500px' }}>
        Hubo un error inesperado al cargar esta página. No te preocupes, el chef ya está revisando
        qué pasó.
      </p>

      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <button
          onClick={() => reset()}
          className="btn btn-primary"
          style={{ padding: '1.2rem 2.4rem' }}
        >
          Reintentar
        </button>
        <Link href="/" className="btn btn-secondary" style={{ padding: '1.2rem 2.4rem' }}>
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
