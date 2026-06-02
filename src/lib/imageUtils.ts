/**
 * Comprime una imagen (File) redimensionándola si es necesario y convirtiéndola a formato WEBP.
 * 
 * @param file El archivo de imagen original (e.g. de un input type="file")
 * @param maxWidth El ancho máximo permitido para la imagen
 * @param maxHeight El alto máximo permitido para la imagen
 * @param quality La calidad de compresión WEBP (0.0 a 1.0)
 * @returns Promesa que resuelve a un string en base64 de la imagen comprimida en WEBP
 */
export const compressImageToWebp = (
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 1200,
  quality: number = 0.8
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 1. Leer el archivo como Data URL
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        // 2. Calcular nuevas dimensiones manteniendo la proporción
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        // 3. Dibujar en un canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo obtener el contexto 2D del canvas'));
          return;
        }
        
        // Rellenar de blanco en caso de PNGs transparentes (opcional, pero recomendado para WEBP si pierde alfa)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        
        // Dibujar la imagen escalada
        ctx.drawImage(img, 0, 0, width, height);

        // 4. Extraer como WEBP
        const webpDataUrl = canvas.toDataURL('image/webp', quality);
        resolve(webpDataUrl);
      };

      img.onerror = (err) => {
        reject(err);
      };
    };

    reader.onerror = (err) => {
      reject(err);
    };
  });
};
