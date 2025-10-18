
import type { Base64Image } from '../types';

export const fileToBase64 = (file: File): Promise<Base64Image> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = (error) => reject(error);
  });
};

// A cache to store fetched image data to avoid re-fetching
const imageCache = new Map<string, Promise<Base64Image>>();

export const urlToBase64 = (url: string): Promise<Base64Image> => {
  if (imageCache.has(url)) {
    return imageCache.get(url)!;
  }

  const promise = fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.blob();
    })
    .then(blob => {
      return new Promise<Base64Image>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          resolve({ base64, mimeType: blob.type });
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    });

  imageCache.set(url, promise);
  return promise;
};
