export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  // On Vercel, messages are persisted in Firestore and read directly by the frontend.
  // This endpoint returns an empty array — the frontend subscription to Firestore
  // is the real-time source of truth.
  res.json({ messages: [] });
}
