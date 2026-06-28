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
    console.log('compressImageToWebp: Starting object URL creation');
    const objectUrl = URL.createObjectURL(file);
    console.log('compressImageToWebp: Object URL created', objectUrl);
    
    const img = new Image();
    
    img.onload = () => {
      console.log('compressImageToWebp: img.onload FIRED');
      
      let width = img.width;
      let height = img.height;
      console.log(`compressImageToWebp: original size ${width}x${height}`);

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }
      console.log(`compressImageToWebp: new size ${width}x${height}`);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('compressImageToWebp: canvas context failed');
        reject(new Error('No se pudo obtener el contexto 2D del canvas'));
        return;
      }
      
      console.log('compressImageToWebp: drawing image to canvas');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      
      console.log('compressImageToWebp: revoking URL');
      URL.revokeObjectURL(objectUrl);

      console.log('compressImageToWebp: converting to webp');
      const webpDataUrl = canvas.toDataURL('image/webp', quality);
      console.log('compressImageToWebp: webp conversion successful, length:', webpDataUrl.length);
      resolve(webpDataUrl);
    };

    img.onerror = (err) => {
      console.error('compressImageToWebp: img.onerror FIRED', err);
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Error al cargar la imagen para compresión.'));
    };

    console.log('compressImageToWebp: setting img.src');
    img.src = objectUrl;
  });
};
