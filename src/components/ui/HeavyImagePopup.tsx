'use client';

import React, { useState, useEffect } from 'react';

export default function HeavyImagePopup() {
  const [countdown, setCountdown] = useState(6);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="modal-overlay" style={{ zIndex: 99999 }}>
      <div 
        className="modal-content" 
        style={{ 
          textAlign: 'center', 
          padding: '4rem',
          maxWidth: '500px',
          background: 'var(--bg-color)',
          border: '1px solid var(--border-color, rgba(0,0,0,0.1))',
          borderRadius: '2.4rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2.5rem'
        }}
      >
        <div 
          style={{
            width: '8rem',
            height: '8rem',
            background: 'linear-gradient(135deg, var(--primary-color) 0%, #ff8e75 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 10px 25px rgba(255, 126, 103, 0.4)',
            animation: 'pulse 2s infinite'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '4rem', height: '4rem' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>

        <div>
          <h2 style={{ fontSize: '2.6rem', marginBottom: '1.2rem', fontWeight: '800', color: 'var(--text-color)', letterSpacing: '-0.02em' }}>
            Optimizando Imagen
          </h2>
          <p style={{ fontSize: '1.6rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: '0 auto', maxWidth: '85%' }}>
            Has seleccionado una foto de alta resolución. Estamos comprimiéndola para que tu perfil cargue súper rápido.
          </p>
        </div>

        <div style={{
          background: 'rgba(0,0,0,0.03)',
          padding: '1.5rem 3rem',
          borderRadius: '1.5rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
           <span 
             className="loading-spinner" 
             style={{ 
               width: '2.2rem', 
               height: '2.2rem', 
               borderWidth: '3px', 
               borderColor: 'rgba(0,0,0,0.1)', 
               borderTopColor: 'var(--primary-color)' 
             }}
           ></span>
           <span style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--primary-color)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.05em' }}>
             {countdown}s
           </span>
        </div>
      </div>
    </div>
  );
}
