export type Translations = {
  nav: {
    explore: string;
    categories: string;
    community: string;
    search_placeholder: string;
    my_profile: string;
    my_recipes: string;
    favorites: string;
    logout: string;
    login: string;
    theme_light: string;
    theme_dark: string;
  };
  common: {
    recipes: string;
    home: string;
    world: string;
    view_all: string;
    back: string;
  };
  countries: Record<string, string>;
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    view_recipe: string;
  };
  home: {
    browse_country: string;
    view_all: string;
    recipe_type: string;
    filters: {
      all: string;
      vegetarian: string;
      meat: string;
      seafood: string;
      desserts: string;
    };
    share_title: string;
    share_desc: string;
    submit_recipe: string;
    explore_recipes: string;
    no_recipes: string;
    select_country_prompt: string;
  };
  card: {
    prep_time: string;
    view_recipe: string;
    servings: string;
  };
  detail: {
    back_btn: string;
    prep_time: string;
    ingredients: string;
    instructions: string;
    author: string;
    added_favorites: string;
    add_favorite: string;
    remove_favorite: string;
  };
  my_recipes: {
    title: string;
    create_new: string;
    no_recipes: string;
    delete_btn: string;
    confirm_delete: string;
  };
  favorites: {
    title: string;
    no_favorites: string;
    explore_btn: string;
    remove_btn: string;
  };
  profile: {
    title: string;
    name_label: string;
    avatar_label: string;
    save_btn: string;
    saving: string;
    success_msg: string;
    tabs: {
      my_recipes: string;
      favorites: string;
      create: string;
    };
    stats: {
      recipes: string;
      followers: string;
      following: string;
    };
    edit_btn: string;
    edit_modal: {
      title: string;
      name_label: string;
      name_placeholder: string;
      email_label: string;
      email_placeholder: string;
      password_label: string;
      password_placeholder: string;
      update_btn: string;
    };
    create_form: {
      title_label: string;
      title_placeholder: string;
      country_label: string;
      prep_time: string;
      cook_time: string;
      servings: string;
      image_label: string;
      image_placeholder: string;
      ingredients: string;
      add_line: string;
      ingredients_placeholder: string;
      steps: string;
      add_step: string;
      steps_placeholder: string;
      save_draft: string;
      publish_btn: string;
    };
  };
  loginPage: {
    welcome: string;
    subtitle: string;
    email: string;
    email_placeholder: string;
    password: string;
    password_placeholder: string;
    forgot: string;
    sign_in: string;
    no_account: string;
    join: string;
    create_title: string;
    create_subtitle: string;
    name: string;
    name_placeholder: string;
    avatar: string;
    avatar_placeholder: string;
    avatar_upload: string;
    create_btn: string;
    has_account: string;
    creating: string;
    signing_in: string;
    success_msg: string;
    switch_to_register: string;
    switch_to_login: string;
    back_to_login: string;
  };
  recipe: {
    not_found: string;
    anonymous: string;
    world: string;
    prep_time_label: string;
    cook_time_label: string;
    servings_label: string;
    tab_ingredients: string;
    tab_preparation: string;
    tab_nutrition: string;
    full_ingredients: string;
    no_ingredients: string;
    step_by_step: string;
    no_instructions: string;
    no_nutrition: string;
    community_reviews: string;
    leave_review: string;
    rate_this: string;
    review_placeholder: string;
    post_review: string;
    creator_badge: string;
    anonymous_user: string;
    recipe_by: string;
    reviews_count: string;
    add_favorite: string;
    remove_favorite: string;
    chefs_recommendations: string;
    kitchen_gear: string;
    essential: string;
    nice_to_have: string;
    quick_rating_error: string;
    login_required: string;
    provide_rating_comment: string;
    user_rating_label: string;
  };
};

export const translations: Record<'es' | 'en', Translations> = {
  es: {
    nav: {
      explore: 'Explorar',
      categories: 'Categorías',
      community: 'Comunidad',
      search_placeholder: 'Buscar recetas...',
      my_profile: 'Mi Perfil',
      my_recipes: 'Mis Recetas',
      favorites: 'Favoritos',
      logout: 'Cerrar Sesión',
      login: 'Iniciar Sesión',
      theme_light: 'Modo Claro',
      theme_dark: 'Modo Oscuro',
    },
    common: {
      recipes: 'Recetas',
      home: 'Inicio',
      world: 'Mundo',
      view_all: 'Ver Todo',
      back: 'Volver',
      edit: 'Editar',
      delete: 'Eliminar',
    },
    countries: {
      italy: 'Italia',
      mexico: 'México',
      japan: 'Japón',
      spain: 'España',
      usa: 'EE.UU.',
      france: 'Francia',
      thailand: 'Tailandia',
      greece: 'Grecia',
      india: 'India',
      china: 'China',
    },
    hero: {
      badge: 'RECETA DESTACADA',
      title: 'Auténtica Paella Española',
      subtitle:
        'Domina el alma de la cocina española con esta vibrante obra maestra de mariscos y azafrán.',
      view_recipe: 'Ver Receta Completa',
    },
    home: {
      browse_country: 'Explorar por País',
      view_all: 'Ver Todos',
      recipe_type: 'TIPO DE RECETA',
      filters: {
        all: 'Todas las Recetas',
        vegetarian: 'Vegetariano',
        meat: 'Carnes',
        seafood: 'Mariscos',
        desserts: 'Postres',
      },
      share_title: '¡Comparte tu creación!',
      share_desc: 'Sube tus propias recetas y únete a nuestra comunidad global de cocina.',
      submit_recipe: 'Subir Receta',
      explore_recipes: 'Explorar Recetas',
      no_recipes: 'No se encontraron recetas.',
      select_country_prompt: 'Selecciona un país arriba para explorar sus recetas tradicionales.',
    },
    card: {
      prep_time: 'mins',
      view_recipe: 'Ver Receta',
      servings: 'porciones',
    },
    detail: {
      back_btn: 'Volver a inicio',
      prep_time: 'Tiempo de prep',
      ingredients: 'Ingredientes Principales',
      instructions: 'Instrucciones Paso a Paso',
      author: 'Receta de',
      added_favorites: 'Añadido a favoritos',
      add_favorite: 'Añadir a Favoritos',
      remove_favorite: 'Quitar de Favoritos',
    },
    my_recipes: {
      title: 'Mis Recetas Públicas',
      create_new: 'Crear Nueva Receta',
      no_recipes: 'Aún no has publicado ninguna receta.',
      delete_btn: 'Eliminar',
      confirm_delete: '¿Estás seguro de que deseas eliminar esta receta?',
    },
    favorites: {
      title: 'Tus Recetas Favoritas',
      no_favorites: 'Aún no tienes recetas favoritas.',
      explore_btn: 'Explorar Recetas',
      remove_btn: 'Quitar',
    },
    profile: {
      title: 'Mi Perfil',
      name_label: 'Nombre completo',
      avatar_label: 'URL de Avatar (Opcional)',
      save_btn: 'Guardar Cambios',
      saving: 'Guardando...',
      success_msg: 'Perfil actualizado exitosamente',
      tabs: {
        my_recipes: 'Mis Recetas',
        favorites: 'Favoritos Guardados',
        create: 'Crear Receta',
      },
      public: 'Público',
      private: 'Privado',
      stats: {
        recipes: 'Recetas',
        followers: 'Seguidores',
        following: 'Siguiendo',
      },
      edit_btn: 'Editar Perfil',
      edit_modal: {
        title: 'Editar Tu Perfil',
        name_label: 'Nombre Completo',
        name_placeholder: 'Tu Nombre',
        email_label: 'Correo Electrónico',
        email_placeholder: 'ejemplo@dominio.com',
        password_label: 'Nueva Contraseña (dejar en blanco para mantener la actual)',
        password_placeholder: 'Introduce nueva contraseña',
        update_btn: 'Actualizar Perfil',
      },
      create_form: {
        title_label: 'Título de la Receta',
        title_placeholder: 'Ej. Famosa Lasaña de la Abuela',
        country_label: 'País/Origen',
        prep_time: 'Tiempo de Preparación (mins)',
        cook_time: 'Tiempo de Cocción (mins)',
        servings: 'Porciones',
        image_label: 'Subir Imagen',
        image_placeholder: 'Haz clic para subir o arrastra y suelta',
        ingredients: 'Ingredientes',
        add_line: '+ Añadir Línea',
        ingredients_placeholder: 'Enumera los ingredientes uno por línea...',
        steps: 'Pasos de Preparación',
        add_step: '+ Añadir Paso',
        steps_placeholder: 'Describe cada paso claramente...',
        save_draft: 'Guardar Borrador',
        publish_btn: 'Publicar Receta',
      },
    },
    loginPage: {
      welcome: 'Bienvenido de Nuevo',
      subtitle: 'Ingresa tus credenciales para acceder a tus recetas guardadas y panel de cocina.',
      email: 'Correo Electrónico',
      email_placeholder: 'chef@mundorecetas.com',
      password: 'Contraseña',
      password_placeholder: '••••••••',
      forgot: '¿Olvidaste tu contraseña?',
      sign_in: 'Iniciar Sesión',
      no_account: '¿No tienes cuenta?',
      join: 'Únete Hoy',
      create_title: 'Crear Cuenta',
      create_subtitle:
        'Únete a nuestra comunidad global de amantes de la comida y comparte tus recetas secretas.',
      name: 'Nombre Completo',
      name_placeholder: 'Chef Gordon',
      avatar: 'Imagen de Perfil (Opcional)',
      avatar_placeholder: 'Pega la URL de la imagen',
      avatar_upload: 'Subir',
      create_btn: 'Crear Cuenta',
      has_account: '¿Ya tienes una cuenta?',
      creating: 'Creando cuenta...',
      signing_in: 'Iniciando sesión...',
      success_msg: '¡Cuenta creada! Por favor inicia sesión.',
      switch_to_register: '¿No tienes una cuenta? Regístrate aquí',
      switch_to_login: '¿Ya tienes una cuenta? Inicia sesión aquí',
      back_to_login: 'Volver a Iniciar Sesión',
    },
    recipe: {
      not_found: 'Receta no encontrada',
      anonymous: 'Chef Anónimo',
      world: 'MUNDO',
      prep_time_label: 'TIEMPO DE PREP',
      cook_time_label: 'TIEMPO DE COCCIÓN',
      servings_label: 'PORCIONES',
      tab_ingredients: 'Ingredientes',
      tab_preparation: 'Preparación',
      tab_nutrition: 'Nutrición',
      full_ingredients: 'Ingredientes Completos',
      no_ingredients: 'No hay ingredientes en la lista.',
      step_by_step: 'Instrucciones Paso a Paso',
      no_instructions: 'No hay instrucciones proporcionadas.',
      no_nutrition: 'La información nutricional no está disponible para esta receta.',
      community_reviews: 'Reseñas de la Comunidad',
      leave_review: 'Deja una reseña',
      rate_this: 'Califica esta receta:',
      review_placeholder: '¡Cuéntanos cómo te quedó! ¿Hiciste algún cambio?',
      post_review: 'Publicar Reseña',
      creator_badge: 'CREADOR',
      anonymous_user: 'Usuario Anónimo',
      recipe_by: 'RECETA DE',
      reviews_count: 'reseñas',
      add_favorite: 'Añadir a Favoritos',
      remove_favorite: 'Quitar de Favoritos',
      chefs_recommendations: 'Recomendaciones del Chef',
      kitchen_gear: 'Equipo de Cocina',
      essential: 'ESENCIAL',
      nice_to_have: 'BUENO TENER',
      quick_rating_error: 'Error al intentar guardar la calificación.',
      login_required: 'Debes iniciar sesión para dejar una reseña.',
      provide_rating_comment: 'Por favor, proporciona una calificación y un comentario.',
      user_rating_label: 'Calificación de los usuarios',
      already_rated: 'Ya has calificado esta receta. ¡Gracias!',
      must_login_review: 'Debes iniciar sesión para publicar una reseña.',
      no_description: 'Sin descripción disponible.',
      reviews_title: 'Reseñas de la Comunidad',
    },
  },
  en: {
    nav: {
      explore: 'Explore',
      categories: 'Categories',
      community: 'Community',
      search_placeholder: 'Search recipes...',
      my_profile: 'My Profile',
      my_recipes: 'My Recipes',
      favorites: 'Favorites',
      logout: 'Logout',
      login: 'Login',
      theme_light: 'Light Mode',
      theme_dark: 'Dark Mode',
    },
    common: {
      recipes: 'Recipes',
      home: 'Home',
      world: 'World',
      view_all: 'View All',
      back: 'Back',
      edit: 'Edit',
      delete: 'Delete',
    },
    countries: {
      italy: 'Italy',
      mexico: 'Mexico',
      japan: 'Japan',
      spain: 'Spain',
      usa: 'USA',
      france: 'France',
      thailand: 'Thailand',
      greece: 'Greece',
      india: 'India',
      china: 'China',
    },
    hero: {
      badge: 'FEATURED RECIPE',
      title: 'Authentic Spanish Paella',
      subtitle:
        'Master the soul of Spanish cuisine with this vibrant, saffron-infused seafood masterpiece.',
      view_recipe: 'View Full Recipe',
    },
    home: {
      browse_country: 'Browse by Country',
      view_all: 'View All',
      recipe_type: 'RECIPE TYPE',
      filters: {
        all: 'All Recipes',
        vegetarian: 'Vegetarian',
        meat: 'Meat',
        seafood: 'Seafood',
        desserts: 'Desserts',
      },
      share_title: 'Share your creation!',
      share_desc: 'Upload your own recipes and join our global cooking community.',
      submit_recipe: 'Submit Recipe',
      explore_recipes: 'Explore Recipes',
      no_recipes: 'No recipes found.',
      select_country_prompt: 'Select a country above to explore its traditional recipes.',
    },
    card: {
      prep_time: 'mins',
      view_recipe: 'View Recipe',
      servings: 'servings',
    },
    detail: {
      back_btn: 'Back to home',
      prep_time: 'Prep time',
      ingredients: 'Main Ingredients',
      instructions: 'Step-by-Step Instructions',
      author: 'Recipe by',
      added_favorites: 'Added to favorites',
      add_favorite: 'Add to Favorites',
      remove_favorite: 'Remove from Favorites',
    },
    my_recipes: {
      title: 'My Public Recipes',
      create_new: 'Create New Recipe',
      no_recipes: "You haven't published any recipes yet.",
      delete_btn: 'Delete',
      confirm_delete: 'Are you sure you want to delete this recipe?',
    },
    favorites: {
      title: 'Your Favorite Recipes',
      no_favorites: "You don't have any favorite recipes yet.",
      explore_btn: 'Explore Recipes',
      remove_btn: 'Remove',
    },
    profile: {
      title: 'My Profile',
      name_label: 'Full Name',
      avatar_label: 'Avatar URL (Optional)',
      save_btn: 'Save Changes',
      saving: 'Saving...',
      success_msg: 'Profile updated successfully',
      tabs: {
        my_recipes: 'My Recipes',
        favorites: 'Saved Favorites',
        create: 'Create Recipe',
      },
      public: 'Public',
      private: 'Private',
      stats: {
        recipes: 'Recipes',
        followers: 'Followers',
        following: 'Following',
      },
      edit_btn: 'Edit Profile',
      edit_modal: {
        title: 'Edit Your Profile',
        name_label: 'Full Name',
        name_placeholder: 'Your Name',
        email_label: 'Email',
        email_placeholder: 'example@domain.com',
        password_label: 'New Password (leave blank to keep current)',
        password_placeholder: 'Enter new password',
        update_btn: 'Update Profile',
      },
      create_form: {
        title_label: 'Recipe Title',
        title_placeholder: "E.g. Grandma's Famous Lasagna",
        country_label: 'Country/Origin',
        prep_time: 'Prep Time (mins)',
        cook_time: 'Cook Time (mins)',
        servings: 'Servings',
        image_label: 'Image Upload',
        image_placeholder: 'Click to upload or drag & drop',
        ingredients: 'Ingredients',
        add_line: '+ Add Line',
        ingredients_placeholder: 'List ingredients one per line...',
        steps: 'Preparation Steps',
        add_step: '+ Add Step',
        steps_placeholder: 'Describe each step clearly...',
        save_draft: 'Save Draft',
        publish_btn: 'Publish Recipe',
      },
    },
    loginPage: {
      welcome: 'Welcome Back',
      subtitle: 'Enter your credentials to access your saved recipes and kitchen dashboard.',
      email: 'Email Address',
      email_placeholder: 'chef@recipeworld.com',
      password: 'Password',
      password_placeholder: '••••••••',
      forgot: 'Forgot password?',
      sign_in: 'Sign In',
      no_account: 'No account?',
      join: 'Join Today',
      create_title: 'Create Account',
      create_subtitle: 'Join our global community of food lovers and share your secret recipes.',
      name: 'Full Name',
      name_placeholder: 'Chef Gordon',
      avatar: 'Profile Image (Optional)',
      avatar_placeholder: 'Paste image URL',
      avatar_upload: 'Upload',
      create_btn: 'Create Account',
      has_account: 'Already have an account?',
      creating: 'Creating account...',
      signing_in: 'Signing in...',
      success_msg: 'Account created! Please sign in.',
      switch_to_register: "Don't have an account? Register here",
      switch_to_login: 'Already have an account? Sign in here',
      back_to_login: 'Back to Sign In',
    },
    recipe: {
      not_found: 'Recipe not found',
      anonymous: 'Anonymous Chef',
      world: 'WORLD',
      prep_time_label: 'PREP TIME',
      cook_time_label: 'COOK TIME',
      servings_label: 'SERVINGS',
      tab_ingredients: 'Ingredients',
      tab_preparation: 'Preparation',
      tab_nutrition: 'Nutrition',
      full_ingredients: 'Full Recipe Ingredients',
      no_ingredients: 'No ingredients listed.',
      step_by_step: 'Step-by-Step Instructions',
      no_instructions: 'No instructions provided.',
      no_nutrition: 'Nutritional information is not available for this recipe.',
      community_reviews: 'Community Reviews',
      leave_review: 'Leave a review',
      rate_this: 'Rate this recipe:',
      review_placeholder: 'Tell us how it turned out! Did you make any changes?',
      post_review: 'Post Review',
      creator_badge: 'CREATOR',
      anonymous_user: 'Anonymous User',
      recipe_by: 'RECIPE BY',
      reviews_count: 'reviews',
      add_favorite: 'Add to Favorites',
      remove_favorite: 'Remove from Favorites',
      chefs_recommendations: "Chef's Recommendations",
      kitchen_gear: 'Kitchen Gear',
      essential: 'ESSENTIAL',
      nice_to_have: 'NICE TO HAVE',
      quick_rating_error: 'Error trying to save the rating.',
      login_required: 'You must be logged in to leave a review.',
      provide_rating_comment: 'Please provide a rating and a comment.',
      user_rating_label: 'User Rating',
      already_rated: 'You have already rated this recipe. Thanks!',
      must_login_review: 'You must be logged in to post a review.',
      no_description: 'No description available.',
      reviews_title: 'Community Reviews',
    },
  },
};
