import fs from 'fs';

export async function sendToTelegram(text, imagePath = null) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        throw new Error("TELEGRAM_BOT_TOKEN veya TELEGRAM_CHAT_ID .env dosyasında eksik!");
    }

    try {
        if (imagePath && fs.existsSync(imagePath)) {
            const formData = new FormData();
            formData.append('chat_id', chatId);
            formData.append('caption', text);
            
            const blob = await fs.openAsBlob(imagePath);
            formData.append('photo', blob, 'image.jpg');

            const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (!data.ok) {
                throw new Error(`Telegram API Hatası: ${data.description}`);
            }
            console.log("✅ Haber ve görsel Telegram'a başarıyla gönderildi.");
        } else {
            const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: text
                })
            });

            const data = await response.json();
            if (!data.ok) {
                throw new Error(`Telegram API Hatası: ${data.description}`);
            }
            console.log("✅ Haber Telegram'a başarıyla gönderildi (Görsel yok).");
        }
    } catch (error) {
        console.error("❌ Telegram'a gönderim başarısız:", error.message);
        throw error;
    }
}
