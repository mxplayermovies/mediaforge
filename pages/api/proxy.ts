import type { NextApiRequest, NextApiResponse } from 'next';
import { Buffer } from 'buffer';

export const config = {
  api: {
    responseLimit: false, 
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const targetUrl = Array.isArray(url) ? url[0] : url;

  try {
    // NODE.JS FETCH COMPATIBILITY FIX:
    // Node's internal fetch (undici) throws errors on unescaped characters like '|' (pipes),
    // which are common in Amazon asset URLs. We must manually encode ONLY the unsafe characters
    // without double-encoding the rest of the URL structure (://).
    const safeUrl = targetUrl
        .replace(/ /g, '%20')
        .replace(/\|/g, '%7C')
        .replace(/"/g, '%22')
        .replace(/>/g, '%3E')
        .replace(/</g, '%3C')
        .replace(/`/g, '%60');

    const response = await fetch(safeUrl, {
      method: 'GET',
      headers: {
        // Mimic a real browser to bypass basic bot protection (403s) on Google/Amazon
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'identity', // Disable compression to simplify piping
        'Referer': new URL(safeUrl).origin // Some CDNs check referer
      },
      redirect: 'follow'
    });

    if (response.status === 404) {
        return res.status(404).json({ error: "The image is not found at the source URL." });
    }

    if (!response.ok) {
      throw new Error(`Upstream error: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Forward headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Cache heavily to improve performance
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    
    res.status(200).send(buffer);

  } catch (error: any) {
    console.error("Proxy Error:", error.message, targetUrl);
    res.status(500).json({ error: "Failed to fetch media", details: error.message });
  }
}