'use client';
import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import RecipeCard from './RecipeCard';

interface RecipeGridProps {
  recipes: any[];
  loading: boolean;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

export default function RecipeGrid({
  recipes,
  loading,
  page,
  setPage,
  totalPages,
}: RecipeGridProps) {
  const { t } = useAppContext();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, page - 1);
    let end = Math.min(totalPages, page + 1);

    if (page === 1) end = Math.min(totalPages, 3);
    else if (page === totalPages && totalPages > 2) start = Math.max(1, totalPages - 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <section id="explore-section" className="explore-section">
      <div className="explore-header">
        <h2>{t.home?.explore_recipes || 'Explore Recipes'}</h2>
        <div className="grid-toggles">
          <button
            className={`grid-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ width: '2rem', height: '2rem' }}
            >
              <path
                fillRule="evenodd"
                d="M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 15.75a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            className={`grid-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List View"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ width: '2rem', height: '2rem' }}
            >
              <path
                fillRule="evenodd"
                d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {loading ? (
        <div
          style={{
            textAlign: 'center',
            padding: '5rem',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <span
            className="loading-spinner"
            style={{
              borderColor: 'rgba(0,0,0,0.1)',
              borderTopColor: 'var(--primary-color)',
              width: '4rem',
              height: '4rem',
            }}
          ></span>
        </div>
      ) : (
        <div className={`recipe-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
          {recipes.length > 0 ? (
            recipes.map((r) => <RecipeCard key={r.id} recipe={r} />)
          ) : (
            <div
              className="empty-grid-state"
              style={{
                gridColumn: '1/-1',
                textAlign: 'center',
                padding: '6rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(145deg, var(--surface-color, rgba(255,255,255,0.05)) 0%, rgba(255,255,255,0.01) 100%)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                borderRadius: '24px',
                boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.1)',
                margin: '2rem 0',
                transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 50px 0 rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 12px 40px 0 rgba(0, 0, 0, 0.1)';
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, var(--primary-color, #ff4b2b), #ff416c)',
                  padding: '1.8rem',
                  borderRadius: '50%',
                  marginBottom: '2.5rem',
                  boxShadow: '0 8px 25px var(--primary-color-alpha, rgba(255, 75, 43, 0.4))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="#ffffff"
                  style={{
                    width: '3.5rem',
                    height: '3.5rem',
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M21.75 12h-2.25m-.166 5.834-1.591-1.591M12 21.75V19.5m-5.834-.166 1.591-1.591M2.25 12h2.25m.166-5.834 1.591 1.591"
                  />
                </svg>
              </div>
              <h3
                style={{
                  fontSize: '2.4rem',
                  fontWeight: '700',
                  color: 'var(--text-color, #333)',
                  marginBottom: '1.2rem',
                  letterSpacing: '-0.5px'
                }}
              >
                Descubre Nuevos Sabores
              </h3>
              <p
                style={{
                  fontSize: '1.6rem',
                  color: 'var(--text-muted, #777)',
                  maxWidth: '500px',
                  lineHeight: '1.6',
                }}
              >
                {t.home?.select_country_prompt || 'Selecciona una categoría o país en el menú lateral para explorar recetas exclusivas de todo el mundo.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.6rem',
            marginTop: '4rem',
          }}
        >
          <button
            onClick={() => setPage(page > 1 ? page - 1 : 1)}
            disabled={page === 1}
            className="btn btn-secondary"
            style={{ padding: '0.8rem 1.6rem' }}
          >
            &lsaquo;
          </button>

          {getPageNumbers()[0] > 1 && (
            <>
              <button
                onClick={() => setPage(1)}
                className="btn btn-secondary"
                style={{ padding: '0.8rem 1.6rem', minWidth: '40px' }}
              >
                1
              </button>
              {getPageNumbers()[0] > 2 && <span style={{ color: 'var(--text-muted)' }}>...</span>}
            </>
          )}

          {getPageNumbers().map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`btn ${page === p ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.8rem 1.6rem', minWidth: '40px' }}
            >
              {p}
            </button>
          ))}

          {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
            <>
              {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                <span style={{ color: 'var(--text-muted)' }}>...</span>
              )}
              <button
                onClick={() => setPage(totalPages)}
                className="btn btn-secondary"
                style={{ padding: '0.8rem 1.6rem', minWidth: '40px' }}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
            disabled={page >= totalPages}
            className="btn btn-secondary"
            style={{ padding: '0.8rem 1.6rem' }}
          >
            &rsaquo;
          </button>
        </div>
      )}
    </section>
  );
}
