/**
 * Mengunduh file gambar dari URL secara aman menggunakan Blob object.
 * Mencegah perilaku navigasi browser atau membuka tab baru secara tidak sengaja.
 *
 * @param url URL gambar yang akan diunduh (misal: getImageUrl(photo.imageUrlFull))
 * @param suggestedFilename Nama file yang disarankan untuk disimpan
 */
export async function downloadImage(url: string, suggestedFilename?: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}: Gagal mengunduh berkas`);
    
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    
    // Tentukan nama file
    const urlFilename = url.split('/').pop()?.split('?')[0];
    link.download = suggestedFilename || urlFilename || 'sougen-image.webp';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup memory
    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 1000);
  } catch (error) {
    console.warn('Blob download gagal, menggunakan fallback anchor download:', error);
    // Fallback direct link
    const link = document.createElement('a');
    link.href = url;
    const urlFilename = url.split('/').pop()?.split('?')[0];
    link.download = suggestedFilename || urlFilename || 'sougen-image.webp';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
