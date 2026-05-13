import { Metadata } from 'next';
import RecipeDetailClient from '@/components/recipe/RecipeDetailClient';
import { recipeService } from '@/services/recipeService';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const recipe = await recipeService.getRecipeById(id);
    if (!recipe) return { title: 'Receta no encontrada' };

    const title =
      typeof recipe.title === 'object' ? recipe.title.es || recipe.title.en : recipe.title;
    const description =
      typeof recipe.description === 'object'
        ? recipe.description.es || recipe.description.en
        : recipe.description;

    return {
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
        images: [recipe.image_url || '/og-recipe.png'],
      },
    };
  } catch (error) {
    return { title: 'Detalle de Receta' };
  }
}

export default async function RecipePage({ params }: PageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  return <RecipeDetailClient id={id} />;
}
