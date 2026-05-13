'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/Toast';

interface RegisterFormProps {
  t: any;
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ t, onSwitchToLogin }: RegisterFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: name,
          email,
          password,
          avatar_url: avatarUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error during registration');
        setLoading(false);
        return;
      }

      // SUCCESS!
      if (data.token) {
        localStorage.setItem('app_token', data.token);
      }
      showToast(
        t.success_msg || '¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.',
        'success',
      );
      setTimeout(() => onSwitchToLogin(), 2000);
    } catch (err: any) {
      console.error('Register Exception:', err);
      setError(
        'Error de conexión: No se pudo contactar con el servidor local del Backend (Puerto 5000).',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setAvatarUrl(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}>
      <span className="auth-badge">NEW CHEF</span>
      <h1 className="auth-title">{t.create_title || 'Create Account'}</h1>
      <p className="auth-subtitle">
        {t.create_subtitle ||
          'Join our global community of food lovers and share your secret recipes.'}
      </p>

      {error && <div className="feedback-msg feedback-error">{error}</div>}

      <form className="auth-form" onSubmit={handleRegister}>
        <div className="auth-input-group">
          <label className="auth-label">{t.name || 'Full Name'}</label>
          <input
            type="text"
            className="auth-input"
            placeholder={t.name_placeholder || 'Chef Gordon'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ paddingLeft: '1.6rem' }}
            required
          />
        </div>

        <div className="auth-input-group">
          <label className="auth-label">{t.email || 'Email Address'}</label>
          <input
            type="email"
            className="auth-input"
            placeholder={t.email_placeholder || 'example@domain.com'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ paddingLeft: '1.6rem' }}
            required
          />
        </div>

        <div className="auth-input-group">
          <label className="auth-label">{t.password || 'Password'}</label>
          <input
            type="password"
            className="auth-input"
            placeholder={t.password_placeholder || 'Create a strong password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ paddingLeft: '1.6rem' }}
            required
          />
        </div>

        <div className="auth-input-group">
          <label className="auth-label">{t.avatar || 'Profile Image (Optional)'}</label>
          <div className="upload-flex">
            <div className="auth-input-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                />
              </svg>
              <input
                type="url"
                className="auth-input"
                placeholder={t.avatar_placeholder || 'Paste image URL'}
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="btn-upload"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                style={{ width: '2rem', height: '2rem' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                />
              </svg>
              {t.avatar_upload || 'Upload'}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png, image/jpeg, image/webp"
              style={{ display: 'none' }}
            />
          </div>
          <span
            style={{
              fontSize: '1rem',
              color: 'var(--text-muted)',
              fontWeight: 600,
              marginTop: '0.4rem',
              textTransform: 'uppercase',
            }}
          >
            (Formatos permitidos: PNG, JPG, WEBP)
          </span>
        </div>

        <button
          type="submit"
          className="btn btn-dark"
          style={{ padding: '1.6rem', fontSize: '1.6rem', marginTop: '1rem' }}
          disabled={loading}
        >
          {loading ? <span className="loading-spinner"></span> : t.create_btn || 'Create Account'}
        </button>
      </form>

      <div className="auth-switch">
        <button className="btn-switch-auth" onClick={onSwitchToLogin}>
          {t.switch_to_login || 'Already have an account? Sign in here'}
        </button>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
