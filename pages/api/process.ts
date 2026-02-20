export default function handler(req: any, res: any) {
  res.status(410).json({ error: "Endpoint deprecated. Use /api/imageprocess or /api/videoprocess." });
}