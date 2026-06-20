export default async function handler(req, res) {
  const BOT_TOKEN = process.env.BOT_TOKEN;

  if (!BOT_TOKEN) {
    return res.status(500).send('BOT_TOKEN belum di-set di Environment Variables Vercel.');
  }

  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const webhookUrl = `https://${host}/api/telegram`;

  const response = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${encodeURIComponent(webhookUrl)}`
  );
  const data = await response.json();

  if (data.ok) {
    return res.status(200).send(`✅ Webhook berhasil di-set ke: ${webhookUrl}\n\nSekarang bot udah bisa dipakai, coba kirim /start ke bot lo.`);
  }

  return res.status(500).send(`❌ Gagal set webhook: ${JSON.stringify(data)}`);
}
