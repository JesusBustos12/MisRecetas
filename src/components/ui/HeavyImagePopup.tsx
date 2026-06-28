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
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div 
        className="modal-content" 
        style={{ 
          textAlign: 'center', 
          fontFamily: 'Arial, sans-serif',
          padding: '3rem',
          maxWidth: '500px'
        }}
      >
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: 'bold', color: 'var(--text)' }}>
          ¡Imagen Pesada Detectada!
        </h2>
        <p style={{ fontSize: '1.8rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>
          El cambio se va a demorar un poco en guardarse por el peso de la imagen. Por favor espera...
        </p>
        <div style={{ fontSize: '4rem', fontWeight: 'bold', color: 'var(--primary)' }}>
          {countdown}
        </div>
      </div>
    </div>
  );
}
