'use client';
import { useState } from 'react';
import { userService } from '@/services/userService';
import Toast from '@/components/Toast';
import HeavyImagePopup from '@/components/ui/HeavyImagePopup';
import { compressImageToWebp } from '@/lib/imageUtils';

interface EditProfileModalProps {
  user: any;
  profile: any;
  onClose: () => void;
  onUpdate: () => void;
  t: any;
}

export default function EditProfileModal({
  user,
  profile,
  onClose,
  onUpdate,
  t,
}: EditProfileModalProps) {
  const [name, setName] = useState(profile?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [showHeavyPopup, setShowHeavyPopup] = useState(false);
  const [pendingHeavyFile, setPendingHeavyFile] = useState<File | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const updates: any = {
        full_name: name,
        avatar_url: avatarUrl,
      };

      if (email !== user.email) updates.email = email;
      if (password) updates.password = password;

      await userService.updateProfile(user.id, updates);

      if (updates.email) {
        setToast({
          message: 'Email update requested. Please check both emails for confirmation.',
          type: 'info',
        });
      }

      setToast({ message: 'Profile updated successfully!', type: 'success' });
      onUpdate();
      onClose();
    } catch (error: any) {
      setToast({ message: error.message || 'Error updating profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      console.log('Heavy image detected (Modal). Size:', file.size);
      setPendingHeavyFile(file);
      setShowHeavyPopup(true);
      if (e.target) e.target.value = '';
      return;
    }

    console.log('Light image detected (Modal). Size:', file.size);
    try {
      const compressedUrl = await compressImageToWebp(file, 800, 800, 0.8);
      setAvatarUrl(compressedUrl);
    } catch (error) {
      console.error('Error comprimiendo imagen:', error);
      setToast({ message: 'Error procesando la imagen', type: 'error' });
    }
    if (e.target) e.target.value = '';
  };

  const onHeavyPopupComplete = async () => {
    setShowHeavyPopup(false);
    if (pendingHeavyFile) {
      try {
        const compressedUrl = await compressImageToWebp(pendingHeavyFile, 800, 800, 0.8);
        setAvatarUrl(compressedUrl);
      } catch (error) {
        console.error('Error comprimiendo imagen:', error);
        setToast({ message: 'Error procesando la imagen', type: 'error' });
      }
      setPendingHeavyFile(null);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {showHeavyPopup && <HeavyImagePopup onComplete={onHeavyPopupComplete} />}
        <div className="modal-header">
          <h2 className="modal-title">{t.title}</h2>
          <button className="modal-close" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form className="edit-profile-form" onSubmit={handleUpdateProfile}>
          <div className="auth-input-group">
            <label className="auth-label">{t.name_label}</label>
            <input
              type="text"
              className="auth-input"
              placeholder={t.name_placeholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ paddingLeft: '1.6rem' }}
              required
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">{t.email_label}</label>
            <input
              type="email"
              className="auth-input"
              placeholder={t.email_placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ paddingLeft: '1.6rem' }}
              required
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">{t.password_label || 'New Password (Optional)'}</label>
            <input
              type="password"
              className="auth-input"
              placeholder={t.password_placeholder || '••••••••'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingLeft: '1.6rem' }}
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">{t.avatar_label || 'Profile Image'}</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
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
                  placeholder={t.avatar_url_placeholder || 'Paste image URL'}
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <button
                  type="button"
                  className="btn-upload"
                  onClick={() =>
                    (document.getElementById('avatar-file-input') as HTMLInputElement)?.click()
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    style={{ width: '1.8rem', height: '1.8rem' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                    />
                  </svg>
                  {t.avatar_upload_btn || 'Upload Local Image'}
                </button>
                {avatarUrl && (
                  <div
                    className="avatar-preview-mini"
                    style={{
                      width: '4rem',
                      height: '4rem',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '2px solid var(--primary-color)',
                    }}
                  >
                    <img
                      src={avatarUrl}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}
              </div>
              <input
                id="avatar-file-input"
                type="file"
                onChange={handleAvatarUpload}
                accept="image/png, image/jpeg, image/webp"
                style={{ display: 'none' }}
              />
              <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontWeight: 600 }}>
                (Formatos permitidos: PNG, JPG, WEBP)
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: '1.6rem', fontSize: '1.6rem', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? <span className="loading-spinner"></span> : t.update_btn}
          </button>
        </form>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </div>
    </div>
  );
}
