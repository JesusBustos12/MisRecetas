'use client';
import { useState, useRef } from 'react';
import { userService } from '@/services/userService';
import Toast from '@/components/Toast';

interface ProfileHeaderProps {
  user: any;
  profile: any;
  onProfileUpdate: () => void;
  onEditClick: () => void;
  t: any;
}

export default function ProfileHeader({
  user,
  profile,
  onProfileUpdate,
  onEditClick,
  t,
}: ProfileHeaderProps) {
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Url = event.target?.result as string;
      try {
        await userService.uploadAvatar(user.id, base64Url);
        onProfileUpdate();
      } catch (error) {
        setToast({ message: 'Error uploading avatar', type: 'error' });
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const userName = profile?.full_name || 'Chef Anonymous';
  const userAvatar = profile?.avatar_url || 'https://via.placeholder.com/150';
  const recipeCount = profile?.recipes_count || 0; // Podríamos pasar esto como prop o que venga en el perfil

  return (
    <div className="profile-master-card">
      <div className="pmc-left">
        <div className="pmc-avatar-box">
          <img
            src={userAvatar}
            alt={userName}
            style={{ opacity: uploading ? 0.5 : 1, transition: 'opacity 0.2s' }}
          />
          <button
            className="pmc-camera-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <span
                className="loading-spinner"
                style={{
                  width: '1.2rem',
                  height: '1.2rem',
                  borderWidth: '2px',
                  borderColor: 'var(--primary-color)',
                  borderTopColor: 'transparent',
                  display: 'inline-block',
                }}
              ></span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
                <path
                  fillRule="evenodd"
                  d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleAvatarUpload}
          />
        </div>
        <div className="pmc-info">
          <h1 className="pmc-name">{userName}</h1>
          <div className="pmc-meta">
            <span className="pmc-role">
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
                  d="M6 12L3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
              {t.role || 'Home Cook'}
            </span>
            <span className="pmc-dot">•</span>
            <span className="pmc-recipe-count">
              {profile?.recipes_count || 0} {t.recipes_created || 'Recipes Created'}
            </span>
          </div>
        </div>
      </div>
      <div className="pmc-right">
        <button className="pmc-edit-btn" onClick={onEditClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
            />
          </svg>
          {t.edit_btn || 'Edit Profile'}
        </button>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
