/**
 * Image processing utility for CMS image uploads.
 * Converts uploaded image files to WebP format data URLs,
 * compresses resolution and file size, generates thumbnails,
 * and builds automatic SEO ALT tags.
 */

export interface ProcessedImageResult {
  dataUrl: string;
  originalName: string;
  sizeBytes: number;
  width: number;
  height: number;
  altText: string;
}

export async function processAndCompressImage(
  file: File,
  category: string = '에어컨',
  maxWidth: number = 1200,
  maxHeight: number = 900,
  quality: number = 0.82
): Promise<ProcessedImageResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio fit
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Smooth rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to webp data URL
        const dataUrl = canvas.toDataURL('image/webp', quality);
        const approxSizeBytes = Math.round((dataUrl.length * 3) / 4);

        // Auto-generate SEO ALT text
        const altText = `홈케어스 클린업 ${category} 100% 완전분해 세척 현장 고화질 작업 사진 (${width}x${height})`;

        resolve({
          dataUrl,
          originalName: file.name,
          sizeBytes: approxSizeBytes,
          width,
          height,
          altText,
        });
      };
      img.onerror = (err) => reject(err);
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
