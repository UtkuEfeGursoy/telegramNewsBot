# Telegram Haber Botu (AI News Automation) 🤖📰

[![GitHub Actions Status](https://github.com/UtkuEfeGursoy/telegramNewsBot/actions/workflows/bot.yml/badge.svg)](https://github.com/UtkuEfeGursoy/telegramNewsBot/actions)

*English version is below. / İngilizce versiyonu aşağıdadır.*

---

## 🇹🇷 Türkçe 

Bu proje, belirlenen RSS kaynaklarından en güncel haberleri alıp, **Google Gemini AI** kullanarak psikolojik ve etkileşimi yüksek metinler (ve hashtagler) haline getiren ve bunları görseliyle birlikte otomatik olarak **Telegram**'a gönderen bir otomasyon botudur.

Eğer haberin kendi görseli yoksa veya indirilemiyorsa, bot otomatik olarak **Google Görseller'de** haber başlığını aratır ve diğer haber ajanslarının logolarını filtreleyerek en temiz görseli bulup mesaja ekler.

### 🌟 Özellikler
- **Tam Otomatik:** GitHub Actions sayesinde bilgisayarınız kapalıyken bile bulutta tamamen ücretsiz çalışır.
- **Yapay Zeka Destekli (Gemini):** Haber metinlerini sadece kopyalamaz; "Merak Boşluğu", "Zeigarnik Etkisi", "FOMO" gibi psikolojik yazım tekniklerini kullanarak merak uyandırıcı bir formata dönüştürür.
- **Akıllı Görsel Bulucu:** RSS'te görsel yoksa Google'da arama yapar ve logolu/filigranlı görselleri akıllıca eler.
- **Tekrarı Önleme:** Gönderilen haberleri `posted_news.json` dosyasına kaydeder, böylece aynı haberi iki kere paylaşmaz.

### 🚀 Kurulum (GitHub Üzerinden Ücretsiz Kullanım)

1. Bu depoyu (repository) kendi GitHub hesabınıza **Fork** yapın veya kopyalayın.
2. GitHub deponuzda **Settings > Secrets and variables > Actions** menüsüne gidin.
3. Aşağıdaki 3 gizli anahtarı (Secret) ekleyin:
   - `TELEGRAM_BOT_TOKEN`: BotFather'dan aldığınız Telegram bot token'ı.
   - `TELEGRAM_CHAT_ID`: Mesajların gönderileceği kanalın veya kişisel sohbetinizin ID'si.
   - `GEMINI_API_KEY`: Google AI Studio'dan alacağınız ücretsiz Gemini API anahtarı.
4. **Settings > Actions > General** menüsüne gidin, en alttaki **Workflow permissions** kısmından **"Read and write permissions"** seçeneğini işaretleyip kaydedin (Dosyaya okundu işareti koyabilmesi için bu şarttır).
5. Kurulum tamam! Bot her gün ayarlanan saatlerde (`bot.yml` dosyasından değiştirebilirsiniz) otomatik çalışacaktır. Hemen denemek için **Actions** sekmesinden "Run workflow" butonuna basabilirsiniz.

### 💻 Yerel (Local) Kurulum

```bash
# 1. Depoyu indirin
git clone https://github.com/UtkuEfeGursoy/telegramNewsBot.git
cd telegramNewsBot

# 2. Gerekli paketleri yükleyin
npm install

# 3. Ortam değişkenlerini ayarlayın
# .env.example dosyasının adını .env yapın ve içine şifrelerinizi girin

# 4. Botu çalıştırın
npm start
```

---

## 🇬🇧 English

This project is an automated bot that fetches the latest news from specified RSS feeds, uses **Google Gemini AI** to rewrite them into engaging, psychologically-driven texts (with hashtags), and automatically sends them to **Telegram** along with a relevant image.

If the news article doesn't have an image, the bot automatically searches **Google Images** using the news title. It smartly filters out images containing watermarks or logos from competitor news agencies and selects the cleanest one.

### 🌟 Features
- **Fully Automated:** Runs for free in the cloud via GitHub Actions even when your PC is off.
- **AI-Powered (Gemini):** Doesn't just copy-paste text. It applies psychological writing techniques like "Curiosity Gap", "Zeigarnik Effect", and "FOMO" to create highly engaging formats.
- **Smart Image Fallback:** If the RSS lacks an image, it scrapes Google Images, actively rejecting watermarked or branded images from other news outlets.
- **Duplicate Prevention:** Saves posted news to `posted_news.json` so it never posts the same article twice.

### 🚀 Setup (Free Cloud Usage via GitHub Actions)

1. **Fork** or clone this repository to your own GitHub account.
2. Go to **Settings > Secrets and variables > Actions** in your repository.
3. Add the following 3 Secrets:
   - `TELEGRAM_BOT_TOKEN`: Your Telegram bot token from BotFather.
   - `TELEGRAM_CHAT_ID`: The ID of the chat/channel where messages will be sent.
   - `GEMINI_API_KEY`: Your free Gemini API key from Google AI Studio.
4. Go to **Settings > Actions > General**, scroll down to **Workflow permissions**, and select **"Read and write permissions"** (This is required so the bot can save the 'read' status to the JSON file).
5. You're done! The bot will run automatically based on the schedule in `bot.yml`. To test it immediately, go to the **Actions** tab and click "Run workflow".

### 💻 Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/UtkuEfeGursoy/telegramNewsBot.git
cd telegramNewsBot

# 2. Install dependencies
npm install

# 3. Setup environment variables
# Rename .env.example to .env and fill in your credentials

# 4. Run the bot
npm start
```
