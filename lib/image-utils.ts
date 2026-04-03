"use client";

/**
 * Compresses an image file using Canvas API.
 * Returns a base64 data URL string.
 */
export async function compressImage(
  file: File,
  maxDimension: number = 500,
  quality: number = 0.8
): Promise<string> {
  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    throw new Error("Image must be less than 2MB");
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        // Scale down if larger than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height / width) * maxDimension);
            width = maxDimension;
          } else {
            width = Math.round((width / height) * maxDimension);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const base64 = canvas.toDataURL("image/webp", quality);
        resolve(base64);
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
