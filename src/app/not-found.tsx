import Link from 'next/link';

export default function NotFound() {
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
      <div style={{ fontSize: '8rem', marginBottom: '1rem' }}>🥘</div>
      <h1 style={{ fontSize: '4.8rem', color: 'var(--text-dark)', fontWeight: '800' }}>404</h1>
      <h2 style={{ fontSize: '2.4rem', color: 'var(--text-muted)' }}>
        Esta receta no está en nuestro libro
      </h2>
      <p style={{ fontSize: '1.6rem', color: 'var(--text-muted)', maxWidth: '400px' }}>
        Parece que la página que buscas ha sido devorada o nunca existió.
      </p>

      <Link
        href="/"
        className="btn btn-primary"
        style={{ padding: '1.5rem 3rem', marginTop: '1rem', borderRadius: '50px' }}
      >
        Explorar Recetas Reales
      </Link>
    </div>
  );
}
