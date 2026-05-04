import fs from 'fs/promises';
import path from 'path';
import google from 'googlethis';

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

/**
 * Haber görseli yoksa Google Görseller'den habere uygun bir fotoğraf bulup indirir.
 * @param {string} query - Aranacak metin (Haber başlığı)
 * @returns {{ path: string, buffer: Buffer }|null}
 */
export async function downloadGoogleImage(query) {
    try {
        console.log(`\n🔍 Haber görseli bulunamadı. Google'da aranıyor: "${query}"`);
        const images = await google.image(query, { safe: false });
        
        if (!images || images.length === 0) {
            console.warn("⚠️ Google'da uygun görsel bulunamadı.");
            return null;
        }

        // Başka haber sitelerinin logolu/filigranlı görsellerini almamak için kara liste
        const blockedDomains = [
            'sondakika.com', 'aa.com.tr', 'dha.com.tr', 'iha.com.tr', 'ntv.com.tr',
            'haberturk.com', 'hurriyet.com.tr', 'milliyet.com.tr', 'sozcu.com.tr',
            'sabah.com.tr', 'ensonhaber.com', 'trthaber.com', 'cnnturk.com',
            'ahaber.com.tr', 'yenicaggazetesi.com.tr', 'cumhuriyet.com.tr', 'karar.com',
            'yeniakit.com.tr', 'turkiyegazetesi.com.tr', 'birgun.net', 'gazeteduvar.com.tr',
            't24.com.tr', 'haber7.com', 'mynet.com', 'haberler.com', 'bundle.app',
            'youtube.com', 'facebook.com', 'tiktok.com', 'twitter.com', 'x.com'
        ];

        let selectedImageUrl = null;

        for (const img of images) {
            const domain = img.origin?.website?.domain?.toLowerCase() || "";
            const url = img.url.toLowerCase();

            // Eğer domain kara listedeyse veya URL'de logo kelimesi geçiyorsa atla
            const isBlocked = blockedDomains.some(b => domain.includes(b));
            const hasLogo = url.includes('logo') || url.includes('icon') || url.includes('watermark');

            if (!isBlocked && !hasLogo) {
                selectedImageUrl = img.url;
                console.log(`🌐 Temiz görsel bulundu (${domain}): ${selectedImageUrl}`);
                break; // İlk temiz görseli bulduk, döngüden çık
            }
        }

        // Eğer temiz görsel bulamadıysa mecburen ilk çıkanı al
        if (!selectedImageUrl) {
            console.warn("⚠️ Tamamen temiz bir görsel bulunamadı, varsayılan olarak ilk görsel alınıyor.");
            selectedImageUrl = images[0].url;
        }

        const response = await fetch(selectedImageUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ny-bot/1.0)' }
        });

        if (!response.ok) {
            console.warn(`Google görseli indirilemedi (HTTP ${response.status}).`);
            return null;
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const imagePath = path.join(process.cwd(), 'temp_image.jpg');
        await fs.writeFile(imagePath, buffer);

        console.log(`✅ Google görseli kaydedildi: ${imagePath}`);
        return { path: imagePath, buffer };

    } catch (error) {
        console.warn(`⚠️ Google Görsel arama/indirme hatası: ${error.message}`);
        return null;
    }
}
