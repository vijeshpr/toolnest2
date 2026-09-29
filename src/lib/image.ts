import { formatBytes } from './utils';

export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const IMAGE_ACCEPT = IMAGE_TYPES.join(',');
export const MAX_FILE_BYTES = 25 * 1024 * 1024;
export const MAX_PIXELS = 50_000_000;

/** Checks size, declared MIME type and the file's magic bytes. Returns an error message or null. */
export async function validateImageFile(file: File): Promise<string | null> {
  if (file.size === 0) return 'This file is empty.';
  if (file.size > MAX_FILE_BYTES) return `File is too large (${formatBytes(file.size)}). The maximum is 25 MB.`;
  if (!(IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return 'Unsupported format. Please choose a JPG, PNG or WebP image.';
  }
  const head = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const jpeg = head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
  const png = head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47;
  const webp =
    String.fromCharCode(...head.slice(0, 4)) === 'RIFF' && String.fromCharCode(...head.slice(8, 12)) === 'WEBP';
  if (!(jpeg || png || webp)) return "This file doesn't look like a valid JPG, PNG or WebP image.";
  return null;
}

export interface LoadedImage {
  img: HTMLImageElement;
  url: string;
  width: number;
  height: number;
}

export function loadImage(file: Blob): Promise<LoadedImage> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, url, width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('The image could not be read. The file may be corrupted.'));
    };
    img.src = url;
  });
}

export function extFor(mime: string): string {
  return mime === 'image/jpeg' ? 'jpg' : mime === 'image/png' ? 'png' : 'webp';
}

export function baseName(name: string): string {
  return name.replace(/\.[^.]+$/, '') || 'image';
}

/** Draws the image at the given size and encodes it. Throws a user-friendly Error on failure. */
export function renderToBlob(img: HTMLImageElement, w: number, h: number, mime: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return reject(new Error('Your browser could not create a drawing surface.'));
    if (mime === 'image/jpeg') {
      ctx.fillStyle = '#ffffff'; // JPEG has no transparency
      ctx.fillRect(0, 0, w, h);
    }
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, w, h);
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error('The image could not be processed. Try a smaller size.'));
        if (blob.type !== mime) return reject(new Error(`Your browser can't export ${extFor(mime).toUpperCase()}. Choose another format.`));
        resolve(blob);
      },
      mime,
      quality,
    );
  });
}
