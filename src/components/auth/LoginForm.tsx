'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/Toast';
import { useAppContext } from '@/context/AppContext';

interface LoginFormProps {
  t: any;
  onSwitchToRegister: () => void;
}

export default function LoginForm({ t, onSwitchToRegister }: LoginFormProps) {
  const { login, language } = useAppContext();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid credentials');
        setLoading(false);
        return;
      }

      // SUCCESS!
      login(data.user, data.token);
      router.push('/');
    } catch (err: any) {
      console.error('Login Exception:', err);
      setError(
        language === 'es'
          ? 'Error de conexión: No se pudo contactar con el servidor.'
          : 'Connection error: Could not contact the server.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}>
      <h1 className="auth-title">{t.welcome || 'Welcome Back'}</h1>
      <p className="auth-subtitle">
        {t.subtitle || 'Enter your credentials to access your saved recipes and kitchen dashboard.'}
      </p>

      {error && <div className="feedback-msg feedback-error">{error}</div>}

      <form className="auth-form" onSubmit={handleLogin}>
        <div className="auth-input-group">
          <label className="auth-label">{t.email || 'Email Address'}</label>
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
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>
            <input
              type="email"
              className="auth-input"
              placeholder={t.email_placeholder || 'chef@recipeworld.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="auth-input-group">
          <div className="auth-label">
            <span>{t.password || 'Password'}</span>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (!email) {
                  setError(
                    language === 'es'
                      ? 'Por favor, ingresa tu correo primero.'
                      : 'Please enter your email first.',
                  );
                  return;
                }
                setError(
                  language === 'es'
                    ? `Se ha enviado un enlace de recuperación a: ${email}`
                    : `A recovery link has been sent to: ${email}`,
                );
              }}
            >
              {t.forgot || 'Forgot password?'}
            </a>
          </div>
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
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
            <input
              type="password"
              className="auth-input"
              placeholder={t.password_placeholder || '••••••••'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ padding: '1.4rem', fontSize: '1.6rem', marginTop: '1rem' }}
          disabled={loading}
        >
          {loading ? <span className="loading-spinner"></span> : t.sign_in || 'Sign In'}
        </button>
      </form>

      <div className="auth-switch">
        <button className="btn-switch-auth" onClick={onSwitchToRegister}>
          {t.switch_to_register || "Don't have an account? Register here"}
        </button>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
