import fs from 'fs/promises';
import path from 'path';

/**
 * RSS feed'deki orijinal haber görselini URL'den indirir,
 * diske kaydeder ve dosya yolunu döner.
 * @param {string} imageUrl - RSS'ten gelen görsel URL'si
 * @returns {{ path: string, buffer: Buffer }|null}
 */
export async function downloadRssImage(imageUrl) {
    if (!imageUrl) return null;
    try {
        console.log(`Orijinal haber görseli indiriliyor: ${imageUrl}`);
        const response = await fetch(imageUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ny-bot/1.0)' }
        });
        if (!response.ok) {
            console.warn(`Haber görseli indirilemedi (HTTP ${response.status}).`);
            return null;
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Diske kaydet (Twitter upload için gerekli)
        const imagePath = path.join(process.cwd(), 'temp_image.jpg');
        await fs.writeFile(imagePath, buffer);

        console.log(`Haber görseli kaydedildi: ${imagePath}`);
        return { path: imagePath, buffer };
    } catch (error) {
        console.warn(`Haber görseli indirme hatası: ${error.message}`);
        return null;
    }
}

