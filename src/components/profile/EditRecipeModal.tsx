'use client';
import { useState, useRef, useEffect } from 'react';
import { recipeService } from '@/services/recipeService';
import Toast from '@/components/Toast';

interface EditRecipeModalProps {
  recipe: any;
  onClose: () => void;
  onSuccess: () => void;
  t: any;
}

export default function EditRecipeModal({ recipe, onClose, onSuccess, t }: EditRecipeModalProps) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [time, setTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [country, setCountry] = useState('World');
  const [imgUrl, setImgUrl] = useState('');
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [instructions, setInstructions] = useState<string[]>(['']);
  
  // Nutrición
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [carbs, setCarbs] = useState('');

  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setLoading(true);
    try {
      await recipeService.deleteRecipe(recipe.id);
      setToast({ message: 'Receta eliminada correctamente.', type: 'success' });
      onSuccess();
      onClose();
    } catch (error: any) {
      setToast({ message: error.message || 'No se pudo eliminar la receta', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (recipe) {
      // title/description can be JSON objects {es:"...",en:"..."} or plain strings
      const extractText = (val: any): string => {
        if (!val) return '';
        if (typeof val === 'string') return val;
        if (typeof val === 'object') return val.es || val.en || Object.values(val)[0] || '';
        return String(val);
      };

      setTitle(extractText(recipe.title));
      setDesc(extractText(recipe.description));
      setTime(recipe.prep_time != null ? String(recipe.prep_time).replace(' mins', '') : '');
      setCookTime(recipe.cook_time != null ? String(recipe.cook_time).replace(' mins', '') : '');
      setServings(recipe.servings || '');
      setCountry(recipe.category_country || 'World');
      setImgUrl(recipe.image_url || '');

      // Handle nutrition
      if (recipe.nutrition) {
        let nutObj = recipe.nutrition;
        if (typeof nutObj === 'string') {
          try { nutObj = JSON.parse(nutObj); } catch(e) {}
        }
        if (typeof nutObj === 'object') {
          setCalories(nutObj['Calories'] || '');
          setProtein(nutObj['Protein'] || '');
          setFat(nutObj['Fat'] || '');
          setCarbs(nutObj['Carbs'] || '');
        }
      }

      // Handle ingredients - could be JSON string, array, or newline-separated string
      const parseList = (val: any): string[] => {
        if (!val) return [''];
        if (Array.isArray(val)) return val.length > 0 ? val : [''];
        if (typeof val === 'string') {
          try {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) return parsed.length > 0 ? parsed : [''];
          } catch {}
          return val.split('\n').filter(Boolean).length > 0 ? val.split('\n') : [''];
        }
        return [''];
      };

      setIngredients(parseList(recipe.ingredients));
      // The DB column is 'steps', not 'instructions'
      setInstructions(parseList(recipe.steps || recipe.instructions));
    }
  }, [recipe]);

  const handleUpdateRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const nutritionObj: any = {};
    if (calories) nutritionObj['Calories'] = calories;
    if (protein) nutritionObj['Protein'] = protein;
    if (fat) nutritionObj['Fat'] = fat;
    if (carbs) nutritionObj['Carbs'] = carbs;
    const finalNutrition = Object.keys(nutritionObj).length > 0 ? JSON.stringify(nutritionObj) : '{}';

    try {
      await recipeService.updateRecipe(recipe.id, {
        title: JSON.stringify({ es: title, en: title }),
        description: JSON.stringify({ es: desc, en: desc }),
        steps: JSON.stringify(instructions.filter((i) => i.trim())),
        ingredients: JSON.stringify(ingredients.filter((i) => i.trim())),
        prep_time: time ? parseInt(time) : null,
        cook_time: cookTime ? parseInt(cookTime) : null,
        servings: servings ? parseInt(String(servings)) : 4,
        category_country: country,
        image_url: imgUrl,
        nutrition: finalNutrition
      });

      setToast({
        message: t.success_update_msg || 'Recipe Updated Successfully!',
        type: 'success',
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      setToast({ message: error.message || 'Error', type: 'error' });
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
      setImgUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const addIngredient = () => setIngredients([...ingredients, '']);
  const addInstruction = () => setInstructions([...instructions, '']);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '900px' }}
      >
        <div className="modal-header">
          <h2 className="modal-title">{t.profile?.create_form?.edit_title || 'Edit Recipe'}</h2>
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

        <form
          className="create-recipe-form"
          onSubmit={handleUpdateRecipe}
          style={{ padding: 0, boxShadow: 'none', background: 'none' }}
        >
          <div className="cr-group">
            <label className="cr-label">{t.create_form?.title_label || 'Recipe Title'}</label>
            <input
              type="text"
              className="cr-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="cr-group">
            <label className="cr-label">{t.create_form?.description_label || 'Descripción'}</label>
            <textarea
              className="cr-input"
              placeholder={t.create_form?.description_placeholder || 'Describe brevemente tu receta...'}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              style={{ minHeight: '80px', resize: 'vertical' }}
            />
          </div>

          <div className="cr-row-2">
            <div className="cr-group">
              <label className="cr-label">{t.create_form?.country_label || 'Country/Origin'}</label>
              <select
                className="cr-input"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="World">{t.common?.world || 'World'}</option>
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
              <label className="cr-label">{t.create_form?.prep_time || 'Prep Time (mins)'}</label>
              <input
                type="number"
                className="cr-input"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className="cr-row-2">
            <div className="cr-group">
              <label className="cr-label">{t.create_form?.cook_time || 'Cook Time (mins)'}</label>
              <input
                type="number"
                className="cr-input"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
              />
            </div>
            <div className="cr-group">
              <label className="cr-label">{t.create_form?.servings || 'Servings'}</label>
              <input
                type="number"
                className="cr-input"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
              />
            </div>
          </div>

          <div className="cr-group">
            <label className="cr-label">{t.create_form?.image_label || 'Recipe Image'}</label>
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
                cursor: 'pointer'
              }}
            >
              {imgUrl ? (
                <>
                  <img 
                    src={imgUrl} 
                    alt="Recipe Preview" 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} 
                  />
                  <div style={{ position: 'relative', zIndex: 1, background: 'rgba(0,0,0,0.6)', padding: '0.8rem 1.6rem', borderRadius: '4px' }}>
                    <span className="cr-upload-text" style={{ color: '#fff', fontWeight: 600 }}>{t.profile?.create_form?.image_click || 'Click para cambiar imagen'}</span>
                  </div>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '4rem', height: '4rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  <span className="cr-upload-text" style={{ fontWeight: 600 }}>{t.profile?.create_form?.image_select || 'Selecciona una imagen'}</span>
                </>
              )}
            </div>
            <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginTop: '0.6rem', display: 'block' }}>
              {t.profile?.create_form?.formats_allowed || '(Formatos permitidos: PNG, JPG, WEBP)'}
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
            <div className="cr-group">
              <div className="cr-title-row">
                <label className="cr-label">{t.create_form?.ingredients || 'Ingredients'}</label>
              </div>
              <textarea
                className="cr-input"
                style={{ minHeight: '120px' }}
                value={ingredients.join('\n')}
                onChange={(e) => setIngredients(e.target.value.split('\n'))}
              ></textarea>
            </div>
            <div className="cr-group">
              <div className="cr-title-row">
                <label className="cr-label">{t.create_form?.steps || 'Instructions'}</label>
              </div>
              <textarea
                className="cr-input"
                style={{ minHeight: '120px' }}
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
                placeholder={t.profile?.create_form?.cal_ph || 'Calories (ej: 250 kcal)'}
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
              <input
                type="text"
                className="cr-input"
                placeholder={t.profile?.create_form?.prot_ph || 'Protein (ej: 15g)'}
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
              />
              <input
                type="text"
                className="cr-input"
                placeholder={t.profile?.create_form?.fat_ph || 'Fat (ej: 5g)'}
                value={fat}
                onChange={(e) => setFat(e.target.value)}
              />
              <input
                type="text"
                className="cr-input"
                placeholder={t.profile?.create_form?.carbs_ph || 'Carbs (ej: 30g)'}
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
              />
            </div>
          </div>

          <div
            className="cr-form-actions"
            style={{ marginTop: '2rem', justifyContent: 'space-between' }}
          >
            <button
              type="button"
              className="btn"
              style={{
                backgroundColor: confirmDelete ? '#b91c1c' : '#ef4444',
                color: 'white',
                padding: '1rem 2rem',
              }}
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? '...' : confirmDelete ? (t.common?.confirm_delete || '¿Confirmar?') : (t.common?.delete_btn || 'Eliminar Receta')}
            </button>
            <div style={{ display: 'flex', gap: '1.6rem' }}>
              <button type="button" className="cr-btn-draft" onClick={onClose}>
                {t.common?.cancel || 'Cancel'}
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? '...' : (t.common?.save || 'Save Changes')}
              </button>
            </div>
          </div>
        </form>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </div>
    </div>
  );
}
