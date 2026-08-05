import { Redis } from '@upstash/redis';

const kv = Redis.fromEnv();
const IDS_KEY = 'card-sort:response-ids';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, picks } = req.body || {};
    if (!name || typeof name !== 'string' || !picks || typeof picks !== 'object') {
      return res.status(400).json({ error: 'Missing or invalid name/picks' });
    }
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const payload = { id, name, picks, submittedAt: new Date().toISOString() };
    try {
      await kv.set(`card-sort:response:${id}`, payload);
      await kv.sadd(IDS_KEY, id);
      return res.status(200).json({ ok: true, id });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to save response', detail: String(err) });
    }
  }

  if (req.method === 'GET') {
    try {
      const ids = (await kv.smembers(IDS_KEY)) || [];
      const responses = [];
      for (const id of ids) {
        const r = await kv.get(`card-sort:response:${id}`);
        if (r) responses.push(r);
      }
      responses.sort((a, b) => (a.submittedAt > b.submittedAt ? 1 : -1));
      return res.status(200).json({ responses });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to load responses', detail: String(err) });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end('Method Not Allowed');
}