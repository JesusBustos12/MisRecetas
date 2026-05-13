export interface SavedImage {
  id: string;
  url: string;
  type: 'original' | 'mug' | 'billboard' | 'tshirt' | 'edited';
  prompt?: string;
  createdAt: number;
}

const STORAGE_KEY = 'app_saved_images';

export const storageService = {
  getImages: (): SavedImage[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveImage: (image: Omit<SavedImage, 'id' | 'createdAt'>): SavedImage => {
    const images = storageService.getImages();
    const newImage: SavedImage = {
      ...image,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
    };
    images.push(newImage);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
    return newImage;
  },

  clearImages: () => {
    localStorage.removeItem(STORAGE_KEY);
  },
};
