import { chromium } from 'playwright';
import path from 'path';

(async () => {
    console.log("🌍 Tarayıcı açılıyor. Lütfen Twitter'a kendi elinizle giriş yapın...");
    console.log("⏳ Süre sınırınız yok. Giriş yaptıktan sonra terminale otomatik bilgi düşecektir.");

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('https://x.com/login');
    
    // Kullanıcının ana sayfaya (home) düşmesini ve Tweet atma butonunun görünmesini bekle (Süre sınırı yok)
    try {
        await page.waitForSelector('[data-testid="SideNav_NewTweet_Button"]', { timeout: 0 });
        console.log("\n✅ Giriş yapıldığı tespit edildi! Oturum kaydediliyor...");
        
        await context.storageState({ path: path.join(process.cwd(), 'twitter_session.json') });
        console.log("🎉 Oturum başarıyla 'twitter_session.json' dosyasına kaydedildi!");
        console.log("Artık bot arka planda (headless) sorunsuzca tweet atabilir.");
    } catch (e) {
        console.log("İşlem iptal edildi veya tarayıcı kapatıldı.");
    } finally {
        await browser.close();
    }
})();
