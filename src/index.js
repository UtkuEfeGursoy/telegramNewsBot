import { getRandomUnpostedNews } from './services/rssService.js';
import { generateContent } from './services/aiService.js';
import { downloadRssImage, downloadGoogleImage } from './services/imageService.js';
import { sendToTelegram } from './services/telegramService.js';
import dotenv from 'dotenv';
dotenv.config();

async function runBot() {
    console.log("ny (news yours) otomasyonu başlatılıyor...");
    console.log(`Zaman: ${new Date().toLocaleString()}`);

    try {
        // 1. Haberi Seç
        console.log("\n1. RSS'ten paylaşılmamış haber aranıyor...");
        const { selectedNews, markAsPosted } = await getRandomUnpostedNews();
        console.log(`✅ Seçilen Haber: ${selectedNews.title}`);
        console.log(`🖼️  Haber Görseli: ${selectedNews.image || 'Yok'}`);

        const cleanContent = selectedNews.contentSnippet || selectedNews.content || selectedNews.description || "";

        // 2. Orijinal Haber Görselini İndir (Gemini bağlamı için)
        console.log("\n2. Orijinal haber görseli Gemini için alınıyor...");
        let imageResult = await downloadRssImage(selectedNews.image);
        
        if (!imageResult) {
            // Eğer RSS'te görsel yoksa veya indirilemediyse Google'da ara
            imageResult = await downloadGoogleImage(selectedNews.title);
        }

        if (imageResult) {
            console.log("✅ Görsel Gemini analizine hazır.");
        } else {
            console.log("⚠️  Görsel hiçbir şekilde bulunamadı, Gemini sadece metinle çalışacak.");
        }

        // 3. Gemini ile Tweet Metni Üret
        console.log("\n3. Gemini API ile tweet metni üretiliyor...");
        const aiResult = await generateContent(
            selectedNews.title,
            cleanContent,
            imageResult ? imageResult.buffer : null
        );

        // Hashtag'leri tweet metnine 280 karakter sınırını aşmadan ekle
        const hashtags = Array.isArray(aiResult.hashtags) ? aiResult.hashtags : [];
        let finalTweet = aiResult.tweetText.trim();
        const combined = `${finalTweet}\n\n${hashtags.join(' ')}`;
        if (combined.length <= 280) {
            finalTweet = combined;
        } else {
            let partial = finalTweet + '\n\n';
            let addedCount = 0;
            for (const tag of hashtags) {
                const next = partial + (addedCount > 0 ? ' ' : '') + tag;
                if (next.length <= 280) { partial = next; addedCount++; }
                else if (addedCount < 5) { partial = partial + (addedCount > 0 ? ' ' : '') + tag; addedCount++; }
                else break;
            }
            finalTweet = partial.trim();
        }

        console.log("\n--- AI ÇIKTISI ---");
        console.log("🧠 Kullanılan Psikolojik Teknik:", aiResult.usedTechnique);
        console.log(`📢 Final Tweet (${finalTweet.length}/280):\n${finalTweet}`);
        console.log("------------------\n");

        // 4. Twitter API ile Gönder
        if (process.env.DRY_RUN === 'true') {
            console.log("DRY_RUN aktif. Telegram'a gönderilmedi.");
            console.log("\u2705 Sim\u00fclasyon ba\u015far\u0131yla tamamland\u0131!");
        } else {
            console.log("4. Telegram'a gönderiliyor...");
            await sendToTelegram(finalTweet, imageResult ? 'temp_image.jpg' : null);
            await markAsPosted();
            console.log("\u2705 Haber 'payla\u015f\u0131ld\u0131' olarak i\u015faretlendi.");
        }

    } catch (error) {
        console.error("Otomasyon sırasında kritik bir hata oluştu:", error.message);
        process.exit(1);
    }
}

runBot();
