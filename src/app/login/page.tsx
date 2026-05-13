'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

type AuthView = 'login' | 'register';

export default function AuthPage() {
  const router = useRouter();
  const { user, isAuthLoaded, t } = useAppContext();
  const [view, setView] = useState<AuthView>('login');

  useEffect(() => {
    if (!isAuthLoaded) return;
    if (user) {
      router.push('/');
    }
  }, [user, isAuthLoaded, router]);

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    // This is still in the page for now as it's common or could be a separate component too
    console.warn('OAuth not implemented in this demo');
  };

  return (
    <div
      className="auth-container"
      style={{ maxWidth: '600px', margin: '3.2rem auto', justifyContent: 'center' }}
    >
      {view === 'login' ? (
        <div className="auth-left" style={{ width: '100%' }}>
          <LoginForm t={t.loginPage || {}} onSwitchToRegister={() => setView('register')} />
        </div>
      ) : (
        <div className="auth-right" style={{ width: '100%' }}>
          <RegisterForm t={t.loginPage || {}} onSwitchToLogin={() => setView('login')} />

          <div className="security-note">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <strong>Security Note</strong>
              <p>Your connection is encrypted. We never share your data with third parties.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
