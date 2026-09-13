/**
 * Ekstraksi warna dominan bersemangat (vibrant) dari gambar untuk aksen dinamis UI
 */
export function extractDominantColor(imgSrc: string, callback: (color: string) => void) {
  if (!imgSrc) {
    callback('#0094DE');
    return;
  }

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = imgSrc;
  img.onload = () => {
    const processPixels = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = 40;
        canvas.height = 40;
        ctx.drawImage(img, 0, 0, 40, 40);
        const data = ctx.getImageData(0, 0, 40, 40).data;
        
        let maxScore = -1;
        let bestR = 0, bestG = 148, bestB = 222; // default sougen blue

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          if (a < 128) continue; // skip transparan

          // Cari warna dengan saturasi dan kecerahan hidup
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const delta = max - min;
          const saturation = max === 0 ? 0 : delta / max;
          const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

          if (saturation > 0.25 && brightness > 0.3 && brightness < 0.95) {
            const score = saturation * 2 + (1 - Math.abs(brightness - 0.6));
            if (score > maxScore) {
              maxScore = score;
              bestR = r;
              bestG = g;
              bestB = b;
            }
          }
        }

        if (maxScore > -1) {
          callback(`rgb(${bestR}, ${bestG}, ${bestB})`);
        }
      } catch {
        callback('#0094DE');
      }
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(processPixels, { timeout: 1000 });
    } else {
      setTimeout(processPixels, 1);
    }
  };
  img.onerror = () => callback('#0094DE');
}
