import { TwitterApi } from 'twitter-api-v2';
import fs from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();

function getTwitterClient() {
    if (!process.env.TWITTER_APP_KEY || !process.env.TWITTER_APP_SECRET || !process.env.TWITTER_ACCESS_TOKEN || !process.env.TWITTER_ACCESS_SECRET) {
        throw new Error("Twitter API anahtarları eksik!");
    }

    return new TwitterApi({
        appKey: process.env.TWITTER_APP_KEY,
        appSecret: process.env.TWITTER_APP_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });
}

export async function postTweetWithMedia(text, mediaPath) {
    const client = getTwitterClient();

    try {
        if (mediaPath) {
            console.log("Medya Twitter'a yükleniyor...");
            try {
                const mediaId = await client.v1.uploadMedia(mediaPath);
                console.log(`Medya yüklendi. Media ID: ${mediaId}`);
                
                console.log("Tweet gönderiliyor...");
                const tweet = await client.v2.tweet({
                    text: text,
                    media: { media_ids: [mediaId] }
                });
                console.log(`Tweet başarıyla gönderildi! Tweet ID: ${tweet.data.id}`);
                return tweet.data;
            } catch (mediaError) {
                // Free tier medya desteklemiyorsa 402 hatası döner, sadece metin atılır
                if (mediaError.code === 402 || (mediaError.data && mediaError.data.title === 'CreditsDepleted')) {
                    console.warn("⚠️  Medya yükleme kredisi yetersiz veya Free tier'dasınız. Görsel olmadan sadece metin tweet atılıyor...");
                    const tweet = await client.v2.tweet({ text });
                    console.log(`✅ Metin tweet başarıyla gönderildi! Tweet ID: ${tweet.data.id}`);
                    return tweet.data;
                }
                throw mediaError;
            }
        } else {
            console.log("Görselsiz tweet gönderiliyor...");
            const tweet = await client.v2.tweet({ text });
            console.log(`✅ Metin tweet başarıyla gönderildi! Tweet ID: ${tweet.data.id}`);
            return tweet.data;
        }
    } catch (error) {
        console.error("Twitter API Hatası:", error);
        throw error;
    } finally {
        // Geçici görseli temizle
        if (mediaPath) {
            try {
                await fs.unlink(mediaPath);
            } catch (e) { /* sessizce geç */ }
        }
    }
}
