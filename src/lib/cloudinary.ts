const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Sube una imagen (Base64) a Cloudinary y devuelve la URL segura pública.
 * Utiliza el endpoint de backend para obtener la firma segura.
 */
export async function uploadImageToCloudinary(base64Image: string): Promise<string> {
  try {
    // 1. Obtener la firma y timestamp desde nuestro backend
    const token = typeof window !== 'undefined' ? localStorage.getItem('app_token') : null;
    
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const signResponse = await fetch(`${API_URL}/cloudinary/sign`, { headers });

    if (!signResponse.ok) {
      throw new Error('Error al obtener la firma de Cloudinary');
    }

    const { timestamp, signature } = await signResponse.json();
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

    if (!cloudName || !apiKey) {
      throw new Error('Faltan credenciales públicas de Cloudinary en el entorno');
    }

    // 2. Preparar el formData para subir directamente a Cloudinary
    const formData = new FormData();
    formData.append('file', base64Image);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('api_key', apiKey);

    // 3. Subir la imagen
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      console.error('Cloudinary upload error:', errorData);
      throw new Error('Error al subir la imagen a Cloudinary');
    }

    const data = await uploadResponse.json();
    return data.secure_url; // Esta es la URL pública que guardaremos en TiDB

  } catch (error) {
    console.error('uploadImageToCloudinary failed:', error);
    throw error;
  }
}
