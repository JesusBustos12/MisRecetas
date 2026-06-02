'use client';
import { useState, useRef } from 'react';
import { recipeService } from '@/services/recipeService';
import Toast from '@/components/Toast';

interface RecipeFormProps {
  user: any;
  onSuccess: () => void;
  t: any;
}

export default function RecipeForm({ user, onSuccess, t }: RecipeFormProps) {
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
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const finalIngredients = JSON.stringify(ingredients.filter((i) => i.trim()));
    const finalSteps = JSON.stringify(instructions.filter((i) => i.trim()));
    
    const nutritionObj: any = {};
    if (calories) nutritionObj['Calories'] = calories;
    if (protein) nutritionObj['Protein'] = protein;
    if (fat) nutritionObj['Fat'] = fat;
    if (carbs) nutritionObj['Carbs'] = carbs;
    const finalNutrition = Object.keys(nutritionObj).length > 0 ? JSON.stringify(nutritionObj) : '{}';

    try {
      await recipeService.createRecipe({
        title,
        description: desc,
        steps: finalSteps,
        ingredients: finalIngredients,
        prep_time: time + ' mins',
        cook_time: cookTime + ' mins',
        servings: servings || '4',
        category_country: country,
        image_url: imgUrl,
        user_id: user.id,
        nutrition: finalNutrition
      });

      setToast({ message: t.success_msg || 'Recipe Published!', type: 'success' });
      setTitle('');
      setDesc('');
      setTime('');
      setCookTime('');
      setServings('');
      setImgUrl('');
      setIngredients(['']);
      setInstructions(['']);
      setCalories('');
      setProtein('');
      setFat('');
      setCarbs('');
      onSuccess();
    } catch (error: any) {
      setToast({ message: error.message || 'Error creating recipe', type: 'error' });
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
  const updateIngredient = (index: number, val: string) => {
    const newArr = [...ingredients];
    newArr[index] = val;
    setIngredients(newArr);
  };

  const addInstruction = () => setInstructions([...instructions, '']);
  const updateInstruction = (index: number, val: string) => {
    const newArr = [...instructions];
    newArr[index] = val;
    setInstructions(newArr);
  };

  return (
    <form className="create-recipe-form" onSubmit={handleCreateRecipe}>
      <div className="cr-group">
        <label className="cr-label">{t.create_form?.title_label || 'Recipe Title'}</label>
        <input
          type="text"
          className="cr-input"
          placeholder={t.create_form?.title_placeholder || "e.g. Grandma's Famous Lasagna"}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="cr-row-2">
        <div className="cr-group">
          <label className="cr-label">{t.create_form?.country_label || 'Country/Origin'}</label>
          <select
            className="cr-input"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{
              appearance: 'none',
              backgroundImage:
                'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right .7em top 50%',
              backgroundSize: '.65em auto',
            }}
          >
            <option value="World">{t.common?.world || 'World'}</option>
            <option value="Italy">Italy</option>
            <option value="Mexico">Mexico</option>
            <option value="Japan">Japan</option>
            <option value="India">India</option>
            <option value="USA">USA</option>
          </select>
        </div>
        <div className="cr-group">
          <label className="cr-label">{t.create_form?.prep_time || 'Prep Time (mins)'}</label>
          <input
            type="number"
            className="cr-input"
            placeholder="15"
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
            placeholder="20"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
          />
        </div>
        <div className="cr-group">
          <label className="cr-label">{t.create_form?.servings || 'Servings'}</label>
          <input
            type="number"
            className="cr-input"
            placeholder="4"
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
                <span className="cr-upload-text" style={{ color: '#fff', fontWeight: 600 }}>{t.create_form?.image_click || 'Click para cambiar imagen'}</span>
              </div>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '4rem', height: '4rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <span className="cr-upload-text" style={{ fontWeight: 600 }}>{t.create_form?.image_select || 'Selecciona una imagen'}</span>
            </>
          )}
        </div>
        <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginTop: '0.6rem', display: 'block' }}>
          {t.create_form?.formats_allowed || '(Formatos permitidos: PNG, JPG, WEBP)'}
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
            <button type="button" className="cr-add-line-btn" onClick={addIngredient}>
              {t.create_form?.add_line || '+ Add line'}
            </button>
          </div>
          <textarea
            className="cr-input"
            placeholder={
              t.create_form?.ingredients_placeholder || 'List ingredients line by line...'
            }
            style={{ minHeight: '150px', resize: 'vertical' }}
            value={ingredients.join('\n')}
            onChange={(e) => setIngredients(e.target.value.split('\n'))}
          ></textarea>
        </div>

        <div className="cr-group">
          <div className="cr-title-row">
            <label className="cr-label">{t.create_form?.steps || 'Instructions'}</label>
            <button type="button" className="cr-add-line-btn" onClick={addInstruction}>
              {t.create_form?.add_step || '+ Add step'}
            </button>
          </div>
          <textarea
            className="cr-input"
            placeholder={t.create_form?.steps_placeholder || 'Describe the steps one by one...'}
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
            placeholder={t.create_form?.cal_ph || 'Calories (ej: 250 kcal)'}
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
          />
          <input
            type="text"
            className="cr-input"
            placeholder={t.create_form?.prot_ph || 'Protein (ej: 15g)'}
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
          />
          <input
            type="text"
            className="cr-input"
            placeholder={t.create_form?.fat_ph || 'Fat (ej: 5g)'}
            value={fat}
            onChange={(e) => setFat(e.target.value)}
          />
          <input
            type="text"
            className="cr-input"
            placeholder={t.create_form?.carbs_ph || 'Carbs (ej: 30g)'}
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
          />
        </div>
      </div>

      <div className="cr-form-actions">
        <button type="button" className="cr-btn-draft">
          {t.create_form?.save_draft || 'Save as Draft'}
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
          disabled={loading}
        >
          {loading ? (
            <span
              className="loading-spinner"
              style={{
                width: '1.6rem',
                height: '1.6rem',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'spin 1s linear infinite',
              }}
            ></span>
          ) : (
            t.create_form?.publish_btn || 'Publish Recipe'
          )}
        </button>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </form>
  );
}
