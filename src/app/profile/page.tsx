'use client';
import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useRouter, useSearchParams } from 'next/navigation';
import RecipeCard from '@/components/RecipeCard';
import { userService } from '@/services/userService';
import { recipeService } from '@/services/recipeService';
import EditRecipeModal from '@/components/profile/EditRecipeModal';
import Toast from '@/components/Toast';

import { Suspense } from 'react';

function ProfileHubContent() {
  const { user, userProfile, setUserProfile, t, isAuthLoaded } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'my_recipes';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [profile, setProfile] = useState<any>(null);
  const [myRecipes, setMyRecipes] = useState<any[]>([]);
  const [favRecipes, setFavRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingRecipe, setEditingRecipe] = useState<any>(null);
  const [recipeToDelete, setRecipeToDelete] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Create Recipe Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newCookTime, setNewCookTime] = useState('');
  const [newServings, setNewServings] = useState('');
  const [newCountry, setNewCountry] = useState('World');
  const [newImgUrl, setNewImgUrl] = useState('');
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [instructions, setInstructions] = useState<string[]>(['']);
  const [formLoading, setFormLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Nutrition State
  const [newCalories, setNewCalories] = useState('');
  const [newProtein, setNewProtein] = useState('');
  const [newFat, setNewFat] = useState('');
  const [newCarbs, setNewCarbs] = useState('');

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const editAvatarInputRef = useRef<HTMLInputElement>(null);

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!isAuthLoaded) return;
    if (!user) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [user, isAuthLoaded]);

  useEffect(() => {
    if (searchParams.get('tab')) {
      setActiveTab(searchParams.get('tab') as string);
    }
  }, [searchParams]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // GET PROFILE (MySQL)
      const profData = await userService.getUserProfile(user.id);
      if (profData) {
        setProfile(profData);
        if (setUserProfile) setUserProfile(profData);
      }

      // GET MY RECIPES (MySQL)
      const myData = await recipeService.getRecipesByUser(user.id);
      setMyRecipes(myData);

      // GET FAVORITES (MySQL)
      const fData = await recipeService.getFavoriteRecipes(user.id);
      setFavRecipes(fData);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
    setLoading(false);
  };

  // Form Event Handlers
  const addIngredient = () => setIngredients([...ingredients, '']);
  const updateIngredient = (index: number, val: string) => {
    const newArr = [...ingredients];
    newArr[index] = val;
    setIngredients(newArr);
  };
  const removeIngredient = (index: number) => {
    if (ingredients.length === 1) return;
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addInstruction = () => setInstructions([...instructions, '']);
  const updateInstruction = (index: number, val: string) => {
    const newArr = [...instructions];
    newArr[index] = val;
    setInstructions(newArr);
  };
  const removeInstruction = (index: number) => {
    if (instructions.length === 1) return;
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleCreateRecipe = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    if (!user) return;
    setFormLoading(true);

    const nutritionObj: any = {};
    if (newCalories) nutritionObj['Calories'] = newCalories;
    if (newProtein) nutritionObj['Protein'] = newProtein;
    if (newFat) nutritionObj['Fat'] = newFat;
    if (newCarbs) nutritionObj['Carbs'] = newCarbs;
    const finalNutrition = Object.keys(nutritionObj).length > 0 ? JSON.stringify(nutritionObj) : '{}';

    const recipeData = {
      title: JSON.stringify({ es: newTitle, en: newTitle }),
      description: JSON.stringify({ es: newDesc || newTitle, en: newDesc || newTitle }),
      steps: JSON.stringify(instructions.filter((i) => i.trim())),
      ingredients: JSON.stringify(ingredients.filter((i) => i.trim())),
      prep_time: newTime ? parseInt(newTime) : null,
      cook_time: newCookTime ? parseInt(newCookTime) : null,
      servings: newServings ? parseInt(newServings) : 4,
      category_country: newCountry,
      image_url: newImgUrl || '/recipes/default.jpg',
      user_id: user.id,
      nutrition: finalNutrition
    };

    try {
      await recipeService.createRecipe(recipeData);
      showToast(t.profile?.success_msg || 'Recipe Published!', 'success');
      setNewTitle('');
      setNewDesc('');
      setNewTime('');
      setNewCookTime('');
      setNewServings('');
      setNewImgUrl('');
      setIngredients(['']);
      setInstructions(['']);
      setNewCalories('');
      setNewProtein('');
      setNewFat('');
      setNewCarbs('');
      setActiveTab('my_recipes');
      fetchData();
    } catch (error: any) {
      showToast(error.message || 'Error al crear la receta', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    setDeleteLoading(true);
    try {
      await recipeService.deleteRecipe(id);
      setMyRecipes(myRecipes.filter((r) => String(r.id) !== String(id)));
      setRecipeToDelete(null);
    } catch (error: any) {
      showToast(error.message || 'No se pudo eliminar la receta', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setNewImgUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setAvatarUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Url = event.target?.result as string;
      try {
        await userService.uploadAvatar(user.id, base64Url);
        if (setUserProfile) {
          setUserProfile(
            userProfile
              ? { ...userProfile, avatar_url: base64Url }
              : { id: user.id, avatar_url: base64Url },
          );
        }
        setProfile((prev: any) => (prev ? { ...prev, avatar_url: base64Url } : prev));
      } catch (error) {
        showToast('Error uploading avatar', 'error');
      } finally {
        setAvatarUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const openEditModal = () => {
    setEditName(profile?.full_name || '');
    setEditEmail(user?.email || '');
    setEditAvatarUrl(profile?.avatar_url || '');
    setEditPassword('');
    setIsEditModalOpen(true);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setEditLoading(true);

    try {
      // 1. Update Profile & Auth (MySQL)
      const updates: any = {
        full_name: editName,
        avatar_url: editAvatarUrl,
      };

      if (editEmail !== user.email) updates.email = editEmail;
      if (editPassword) updates.password = editPassword;

      await userService.updateProfile(user.id, updates);

      if (updates.email) {
        showToast('Email updated successfully.', 'success');
      }
      if (updates.password) {
        showToast('Password updated successfully.', 'success');
      }

      showToast('Profile updated successfully!', 'success');
      setIsEditModalOpen(false);
      fetchData();
    } catch (error: any) {
      showToast(error.message || 'Error updating profile', 'error');
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('El archivo es muy pesado. Máximo 2MB.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setEditAvatarUrl(result);
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div
        className="app-container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <span
          className="loading-spinner"
          style={{
            borderColor: 'rgba(0,0,0,0.1)',
            borderTopColor: 'var(--primary-color)',
            width: '4rem',
            height: '4rem',
            borderWidth: '4px',
          }}
        ></span>
      </div>
    );
  }

  const userName = profile?.full_name || 'Chef Anonymous';
  const cleanHandle = userName.toLowerCase().replace(/\s+/g, '');
  const userAvatar = profile?.avatar_url || 'https://via.placeholder.com/150';

  return (
    <div style={{ paddingBottom: '8rem' }}>
      {/* PROFILE WHITE CARD */}
      <div className="app-container">
        <div className="profile-master-card">
          <div className="pmc-left">
            <div className="pmc-avatar-box">
              <img
                src={userAvatar}
                alt={userName}
                style={{ opacity: avatarUploading ? 0.5 : 1, transition: 'opacity 0.2s' }}
              />
              <button
                className="pmc-camera-btn"
                onClick={() => avatarInputRef.current?.click()}
                disabled={avatarUploading}
              >
                {avatarUploading ? (
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
                ref={avatarInputRef}
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
                  Home Cook
                </span>
                <span className="pmc-dot">•</span>
                <span className="pmc-recipe-count">{myRecipes.length} Recipes Created</span>
              </div>
            </div>
          </div>
          <div className="pmc-right">
            <button className="pmc-edit-btn" onClick={openEditModal}>
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
              {t.profile?.edit_btn || 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="profile-tabs-container">
          <div className="profile-tabs">
            <div
              className={`profile-tab ${activeTab === 'my_recipes' ? 'active' : ''}`}
              onClick={() => router.push('/profile?tab=my_recipes', { scroll: false })}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6v6.25l4.5 2.66-1.13 1.86-5.62-3.33V6h2.25Z" />
              </svg>
              {t.profile?.tabs?.my_recipes || 'My Recipes'}
            </div>
            <div
              className={`profile-tab ${activeTab === 'favorites' ? 'active' : ''}`}
              onClick={() => router.push('/profile?tab=favorites', { scroll: false })}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
              </svg>
              {t.profile?.tabs?.favorites || 'Favorite Recipes'}
            </div>
            <div
              className={`profile-tab ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => router.push('/profile?tab=create', { scroll: false })}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                  clipRule="evenodd"
                />
              </svg>
              {t.profile?.tabs?.create || 'Create New Recipe'}
            </div>
          </div>
        </div>

        {/* TAB SECTION TITLE */}
        <div className="profile-tab-header">
          <div>
            <h2>
              {activeTab === 'my_recipes'
                ? 'Managing My Recipes'
                : activeTab === 'favorites'
                  ? 'My Favorite Recipes'
                  : 'Create New Recipe'}
            </h2>
            {activeTab === 'create' && (
              <p className="profile-tab-subtitle">
                Share your culinary masterpiece with the world.
              </p>
            )}
          </div>
        </div>

        {/* TAB CONTENTS */}
        {activeTab === 'my_recipes' && (
          <div className="recipe-grid">
            {myRecipes.length > 0 ? (
              myRecipes.map((r) => (
                <RecipeCard
                  key={r.id}
                  recipe={r}
                  variant="profile"
                  onEdit={setEditingRecipe}
                  onDelete={setRecipeToDelete}
                />
              ))
            ) : (
              <p
                style={{
                  gridColumn: '1/-1',
                  textAlign: 'center',
                  fontSize: '1.6rem',
                  color: 'var(--text-muted)',
                }}
              >
                {t.my_recipes?.no_recipes || "You haven't published any recipes yet."}
              </p>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="recipe-grid">
            {favRecipes.length > 0 ? (
              favRecipes.map((r) => <RecipeCard key={r.id} recipe={r} variant="profile" />)
            ) : (
              <p
                style={{
                  gridColumn: '1/-1',
                  textAlign: 'center',
                  fontSize: '1.6rem',
                  color: 'var(--text-muted)',
                }}
              >
                {t.favorites?.no_favorites || 'No saved favorites found.'}
              </p>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <form className="create-recipe-form" onSubmit={handleCreateRecipe}>
            <div className="cr-group">
              <label className="cr-label">{t.profile.create_form.title_label}</label>
              <input
                type="text"
                className="cr-input"
                placeholder={t.profile.create_form.title_placeholder}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>

            <div className="cr-group">
              <label className="cr-label">{(t.profile.create_form as any)?.description_label || 'Descripción'}</label>
              <textarea
                className="cr-input"
                placeholder={(t.profile.create_form as any)?.description_placeholder || 'Describe brevemente tu receta...'}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                style={{ minHeight: '80px', resize: 'vertical' }}
              />
            </div>

            <div className="cr-row-2">
              <div className="cr-group">
                <label className="cr-label">{t.profile.create_form.country_label}</label>
                <select
                  className="cr-input"
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                >
                  <option value="World">World / Todas</option>
                  <option value="Italy">Italy</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Japan">Japan</option>
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                  <option value="Spain">Spain</option>
                  <option value="France">France</option>
                  <option value="Thailand">Thailand</option>
                  <option value="Greece">Greece</option>
                  <option value="China">China</option>
                </select>
              </div>
              <div className="cr-group">
                <label className="cr-label">{t.profile.create_form.prep_time}</label>
                <input
                  type="number"
                  className="cr-input"
                  placeholder="15"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                />
              </div>
            </div>

            <div className="cr-row-2">
              <div className="cr-group">
                <label className="cr-label">{t.profile.create_form.cook_time}</label>
                <input
                  type="number"
                  className="cr-input"
                  placeholder="20"
                  value={newCookTime}
                  onChange={(e) => setNewCookTime(e.target.value)}
                />
              </div>
              <div className="cr-group">
                <label className="cr-label">{t.profile.create_form.servings}</label>
                <input
                  type="number"
                  className="cr-input"
                  placeholder="4"
                  value={newServings}
                  onChange={(e) => setNewServings(e.target.value)}
                />
              </div>
            </div>

            <div className="cr-group">
              <label className="cr-label">{t.profile.create_form.image_label}</label>
              <div
                className="cr-upload-box"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  position: 'relative',
                  minHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '2px dashed var(--border-color, rgba(255,255,255,0.2))',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                {newImgUrl ? (
                  <>
                    <img
                      src={newImgUrl}
                      alt="Recipe Preview"
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
                    />
                    <div style={{ position: 'relative', zIndex: 1, background: 'rgba(0,0,0,0.6)', padding: '0.8rem 1.6rem', borderRadius: '4px' }}>
                      <span className="cr-upload-text" style={{ color: '#fff', fontWeight: 600 }}>Click para cambiar imagen</span>
                    </div>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '4rem', height: '4rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    <span className="cr-upload-text" style={{ fontWeight: 600 }}>
                      {t.profile.create_form.image_placeholder}
                    </span>
                  </>
                )}
              </div>
              <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginTop: '0.6rem', display: 'block' }}>
                (Formatos permitidos: PNG, JPG, WEBP)
              </span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/png, image/jpeg, image/webp"
                style={{ display: 'none' }}
              />
            </div>

            <div className="cr-row-2">
              {/* INGREDIENTS */}
              <div className="cr-group" style={{ marginTop: '0' }}>
                <div className="cr-title-row">
                  <label className="cr-label">{t.profile.create_form.ingredients}</label>
                </div>
                <textarea
                  className="cr-input"
                  placeholder={t.profile.create_form.ingredients_placeholder}
                  style={{ minHeight: '150px', resize: 'vertical' }}
                  value={ingredients.join('\n')}
                  onChange={(e) => setIngredients(e.target.value.split('\n'))}
                ></textarea>
              </div>

              {/* INSTRUCTIONS */}
              <div className="cr-group" style={{ marginTop: '0' }}>
                <div className="cr-title-row">
                  <label className="cr-label">{t.profile.create_form.steps}</label>
                </div>
                <textarea
                  className="cr-input"
                  placeholder={t.profile.create_form.steps_placeholder}
                  style={{ minHeight: '150px', resize: 'vertical' }}
                  value={instructions.join('\n')}
                  onChange={(e) => setInstructions(e.target.value.split('\n'))}
                ></textarea>
              </div>
            </div>

            {/* SECCIÓN DE NUTRICIÓN */}
            <div className="cr-group">
              <label className="cr-label">{t.recipe?.tab_nutrition || 'Nutritional Information'} (Opcional)</label>
              <div className="cr-row-2" style={{ gap: '1.6rem', marginTop: '1rem' }}>
                <input
                  type="text"
                  className="cr-input"
                  placeholder="Calories (ej: 250 kcal)"
                  value={newCalories}
                  onChange={(e) => setNewCalories(e.target.value)}
                />
                <input
                  type="text"
                  className="cr-input"
                  placeholder="Protein (ej: 15g)"
                  value={newProtein}
                  onChange={(e) => setNewProtein(e.target.value)}
                />
                <input
                  type="text"
                  className="cr-input"
                  placeholder="Fat (ej: 5g)"
                  value={newFat}
                  onChange={(e) => setNewFat(e.target.value)}
                />
                <input
                  type="text"
                  className="cr-input"
                  placeholder="Carbs (ej: 30g)"
                  value={newCarbs}
                  onChange={(e) => setNewCarbs(e.target.value)}
                />
              </div>
            </div>

            <div className="cr-form-actions">
              <button
                type="button"
                className="cr-btn-draft"
                onClick={(e) => handleCreateRecipe(e as any, true)}
              >
                {t.profile.create_form.save_draft}
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  padding: '1.2rem 3.2rem',
                  fontSize: '1.5rem',
                  borderRadius: '0.8rem',
                  fontWeight: 600,
                }}
                disabled={formLoading}
              >
                {formLoading ? (
                  <span
                    className="loading-spinner"
                    style={{ width: '1.6rem', height: '1.6rem', borderWidth: '2px' }}
                  ></span>
                ) : (
                  t.profile.create_form.publish_btn
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{t.profile.edit_modal.title}</h2>
              <button className="modal-close" onClick={() => setIsEditModalOpen(false)}>
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

            <form className="auth-form" onSubmit={handleUpdateProfile}>
              <div className="auth-input-group">
                <label className="auth-label">{t.profile.edit_modal.name_label}</label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder={t.profile.edit_modal.name_placeholder}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ paddingLeft: '1.6rem' }}
                  required
                />
              </div>

              <div className="auth-input-group">
                <label className="auth-label">{t.profile.edit_modal.email_label}</label>
                <input
                  type="email"
                  className="auth-input"
                  placeholder={t.profile.edit_modal.email_placeholder}
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  style={{ paddingLeft: '1.6rem' }}
                  required
                />
              </div>

              <div className="auth-input-group">
                <label className="auth-label">{t.profile.edit_modal.password_label}</label>
                <input
                  type="password"
                  className="auth-input"
                  placeholder={t.profile.edit_modal.password_placeholder}
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  style={{ paddingLeft: '1.6rem' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '1.6rem', fontSize: '1.6rem', marginTop: '1rem' }}
                disabled={editLoading}
              >
                {editLoading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  t.profile.edit_modal.update_btn
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT RECIPE MODAL */}
      {editingRecipe && (
        <EditRecipeModal
          recipe={editingRecipe}
          onClose={() => setEditingRecipe(null)}
          onSuccess={fetchData}
          t={t.profile || {}}
        />
      )}

      {/* DOM CONFIRM MODAL PARA ELIMINAR RECETA */}
      {recipeToDelete && (
        <div className="modal-overlay" onClick={() => setRecipeToDelete(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '400px', padding: '3.2rem', textAlign: 'center' }}
          >
            <h3
              style={{
                fontSize: '2.4rem',
                marginBottom: '1.6rem',
                color: 'var(--text-color)',
                fontWeight: '800',
              }}
            >
              Confirmar Eliminación
            </h3>
            <p style={{ fontSize: '1.6rem', color: 'var(--text-muted)', marginBottom: '2.4rem' }}>
              ¿Estás seguro de que deseas eliminar verdaderamente la receta{' '}
              <strong>
                "
                {typeof recipeToDelete.title === 'string'
                  ? recipeToDelete.title
                  : recipeToDelete.title?.es}
                "
              </strong>
              ? Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: '1.6rem', justifyContent: 'center' }}>
              <button
                className="cr-btn-draft"
                onClick={() => setRecipeToDelete(null)}
                disabled={deleteLoading}
              >
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                style={{
                  backgroundColor: '#ef4444',
                  padding: '1.2rem 2.4rem',
                  fontSize: '1.5rem',
                  borderRadius: '0.8rem',
                }}
                onClick={() => handleDeleteRecipe(recipeToDelete.id)}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <span
                    className="loading-spinner"
                    style={{ width: '1.6rem', height: '1.6rem', borderWidth: '2px' }}
                  ></span>
                ) : (
                  'Sí, eliminar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default function ProfileHub() {
  return (
    <Suspense
      fallback={
        <div
          className="app-container"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
          }}
        >
          <span
            className="loading-spinner"
            style={{
              borderColor: 'rgba(0,0,0,0.1)',
              borderTopColor: 'var(--primary-color)',
              width: '4rem',
              height: '4rem',
              borderWidth: '4px',
            }}
          ></span>
        </div>
      }
    >
      <ProfileHubContent />
    </Suspense>
  );
}
