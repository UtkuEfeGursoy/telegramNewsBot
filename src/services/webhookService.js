/**
 * Make.com webhook'una tweet verilerini gönderir.
 * Make.com bu veriyi alıp kendi Twitter entegrasyonuyla tweet atar.
 */
export async function sendToMakeWebhook(tweetText, imageUrl) {
    const webhookUrl = process.env.MAKE_WEBHOOK_URL;
    if (!webhookUrl) {
        throw new Error("MAKE_WEBHOOK_URL bulunamadı! .env dosyasına ekleyin.");
    }

    const payload = {
        text: tweetText,
        imageUrl: imageUrl || null
    };

    console.log("Make.com webhook'una gönderiliyor...");
    console.log("Payload:", JSON.stringify(payload, null, 2));

    const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Make.com webhook hatası: ${response.status} - ${body}`);
    }

    console.log(`✅ Make.com webhook'u başarıyla tetiklendi! (HTTP ${response.status})`);
    return true;
}
