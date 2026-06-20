import { redis, keyOf } from '../lib/keystore.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'invalid' });
  }

  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(200).json({ status: 'invalid' });
  }

  const record = await redis.get(keyOf(username));

  if (!record || record.password !== password) {
    return res.status(200).json({ status: 'invalid' });
  }

  if (new Date(record.expiredAt).getTime() < Date.now()) {
    return res.status(200).json({ status: 'expired' });
  }

  return res.status(200).json({ status: 'success', username });
}
