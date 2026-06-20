import { redis, keyOf } from '../lib/keystore.js';

const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendMessage(chatId, text) {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  });
}

function parseExpiry(code) {
  const match = /^(\d+)\s*([dwmy])$/i.exec((code || '').trim());
  if (!match) return null;

  const amount = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  const expires = new Date();

  switch (unit) {
    case 'd': expires.setDate(expires.getDate() + amount); break;
    case 'w': expires.setDate(expires.getDate() + amount * 7); break;
    case 'm': expires.setMonth(expires.getMonth() + amount); break;
    case 'y': expires.setFullYear(expires.getFullYear() + amount); break;
    default: return null;
  }
  return expires;
}

function formatTanggal(date) {
  return date.toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send('XylonWebz bot webhook aktif.');
  }

  const update = req.body;
  const msg = update && update.message;

  if (!msg || !msg.text) {
    return res.status(200).json({ ok: true });
  }

  const chatId = msg.chat.id;
  const text = msg.text.trim();

  if (text.startsWith('/start')) {
    const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;

    await sendMessage(chatId,
`👋 *WELCOME ${username}*

📜 *Code Command Yang Tersedia*
\`/ckey\` — Buat key akses login baru

📌 *Contoh Ckey*
\`/ckey devzz,auiop,99d\`

Format: \`/ckey username,password,expired\`

⏳ *Kode Expired:*
d = Day (hari)
w = Week (minggu)
m = Month (bulan)
y = Years (tahun)

Contoh: \`30d\` artinya key aktif 30 hari dari sekarang.`);

    return res.status(200).json({ ok: true });
  }

  if (text.startsWith('/ckey')) {
    const argsRaw = text.replace(/^\/ckey\s*/, '');
    const usage =
`⚠️ Format salah.

Pakai format ini:
\`/ckey username,password,expired\`

Contoh:
\`/ckey devzz,auiop,99d\`

Kode expired: d (hari), w (minggu), m (bulan), y (tahun)`;

    if (!argsRaw || argsRaw === '/ckey') {
      await sendMessage(chatId, usage);
      return res.status(200).json({ ok: true });
    }

    const parts = argsRaw.split(',').map((s) => s.trim());
    if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) {
      await sendMessage(chatId, usage);
      return res.status(200).json({ ok: true });
    }

    const [username, password, expiredCode] = parts;
    const expiresAt = parseExpiry(expiredCode);

    if (!expiresAt) {
      await sendMessage(chatId,
        `⚠️ Format expired \`${expiredCode}\` ga valid.\n\nPakai angka + huruf, contoh: \`30d\`, \`2w\`, \`6m\`, \`1y\``);
      return res.status(200).json({ ok: true });
    }

    await redis.set(keyOf(username), {
      password,
      expiredAt: expiresAt.toISOString(),
      createdBy: msg.from.id,
      createdAt: new Date().toISOString(),
    });

    await sendMessage(chatId,
`✅ *Key Berhasil Dibuat!*

👤 Username: \`${username}\`
🔑 Password: \`${password}\`
⏳ Expired: ${formatTanggal(expiresAt)}

Langsung login di web pakai username & password di atas ya 🚀`);

    return res.status(200).json({ ok: true });
  }

  return res.status(200).json({ ok: true });
}
