# Sistema Maestro de Recetas

Este directorio es la única fuente de verdad para el catálogo de recetas de la aplicación.

## Contenido Principal

*   **[RESTAURACION_MAESTRA_TOTAL.cjs](./RESTAURACION_MAESTRA_TOTAL.cjs)**: El script definitivo para restaurar la base de datos.
    *   Limpia todas las tablas (`recipes`, `users`, `comments`, `favorites`).
    *   Crea **10 usuarios** con perfiles completos.
    *   Inserta **302 recetas** con ingredientes detallados, pasos, nutrición y fotos.
    *   Genera interacciones automáticas (3-13 comentarios y 4-11 favoritos por receta).
*   **[ImgRecetas/](./ImgRecetas/)**: Contiene todas las imágenes utilizadas en las recetas, organizadas por país.

## Instrucciones de Uso

Para reconstruir la base de datos completa desde cero:
```bash
node Recetas/RESTAURACION_MAESTRA_TOTAL.cjs
```

## Historial
Todos los scripts antiguos de corrección y datos intermedios han sido movidos a la carpeta `archive/` para mantener el proyecto limpio.
