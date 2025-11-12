export function createThumbnail(
  canvas: HTMLCanvasElement,
  maxWidth: number = 200
): string {
  const thumbnailCanvas = document.createElement('canvas');
  const ctx = thumbnailCanvas.getContext('2d');

  if (!ctx) return '';

  const aspectRatio = canvas.height / canvas.width;
  thumbnailCanvas.width = maxWidth;
  thumbnailCanvas.height = maxWidth * aspectRatio;

  ctx.drawImage(canvas, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

  return thumbnailCanvas.toDataURL('image/png', 0.7);
}

export function getCanvasBlob(
  canvas: HTMLCanvasElement,
  quality: number = 0.8
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/png', quality);
  });
}

export function isCanvasEmpty(canvas: HTMLCanvasElement): boolean {
  const ctx = canvas.getContext('2d');
  if (!ctx) return true;

  const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  // Check if all pixels are transparent or white
  for (let i = 0; i < pixelData.length; i += 4) {
    const alpha = pixelData[i + 3];
    if (alpha !== 0) {
      // Check if it's not white
      if (pixelData[i] !== 255 || pixelData[i + 1] !== 255 || pixelData[i + 2] !== 255) {
        return false;
      }
    }
  }

  return true;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getMousePos(
  canvas: HTMLCanvasElement,
  evt: MouseEvent | TouchEvent
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  let clientX: number;
  let clientY: number;

  if ('touches' in evt) {
    clientX = evt.touches[0].clientX;
    clientY = evt.touches[0].clientY;
  } else {
    clientX = evt.clientX;
    clientY = evt.clientY;
  }

  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
}
