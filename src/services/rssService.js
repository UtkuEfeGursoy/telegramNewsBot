import Parser from 'rss-parser';
import fs from 'fs/promises';
import path from 'path';

const parser = new Parser({
    customFields: {
        item: ['image'],
    }
});
const POSTED_NEWS_FILE = path.join(process.cwd(), 'posted_news.json');

// AA'nın genel, teknoloji veya güncel rss beslemeleri kullanılabilir.
// AA Güncel: https://www.aa.com.tr/tr/rss/default?cat=guncel
// Tüm AA Rss listesi: https://www.aa.com.tr/tr/p/rss-yayinlari
const RSS_FEEDS = [
    'https://www.aa.com.tr/tr/rss/default?cat=guncel',
    'https://www.aa.com.tr/tr/rss/default?cat=dunya'
];

async function loadPostedNews() {
    try {
        const data = await fs.readFile(POSTED_NEWS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // Dosya yoksa veya hatalıysa boş dizi dön
        return [];
    }
}

async function savePostedNews(postedList) {
    // Son 100 kaydı tutalım, çok büyümesin
    const trimmedList = postedList.slice(-100);
    await fs.writeFile(POSTED_NEWS_FILE, JSON.stringify(trimmedList, null, 2), 'utf-8');
}

export async function getRandomUnpostedNews() {
    const postedNews = await loadPostedNews();
    let allNews = [];

    // Tüm feed'lerden haberleri çek
    for (const feedUrl of RSS_FEEDS) {
        try {
            const feed = await parser.parseURL(feedUrl);
            allNews = [...allNews, ...feed.items];
        } catch (error) {
            console.error(`RSS okuma hatası (${feedUrl}):`, error.message);
        }
    }

    if (allNews.length === 0) {
        throw new Error("RSS kaynaklarından hiçbir haber çekilemedi.");
    }

    // Daha önce paylaşılmamış haberleri filtrele
    // guid (id) veya title üzerinden kontrol edebiliriz
    const unpostedNews = allNews.filter(news => !postedNews.includes(news.guid || news.title));

    if (unpostedNews.length === 0) {
        throw new Error("Tüm güncel haberler zaten paylaşılmış. Yeni haber yok.");
    }

    // Sadece son 50 haber arasından rastgele seç ki çok eski bir haber olmasın
    const recentUnposted = unpostedNews.slice(0, 50);
    const randomIndex = Math.floor(Math.random() * recentUnposted.length);
    const selectedNews = recentUnposted[randomIndex];

    return {
        selectedNews,
        markAsPosted: async () => {
            postedNews.push(selectedNews.guid || selectedNews.title);
            await savePostedNews(postedNews);
        }
    };
}
