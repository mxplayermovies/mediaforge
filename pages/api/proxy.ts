// import type { NextApiRequest, NextApiResponse } from 'next';

// export const config = {
//   api: {
//     responseLimit: false, 
//     bodyParser: false,
//   },
// };

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { url } = req.query;

//   if (!url || typeof url !== 'string') {
//     return res.status(400).json({ error: 'URL is required' });
//   }

//   try {
//     // Stealth Headers: Mimic a real Chrome browser
//     const headers = new Headers();
//     headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
//     headers.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8');
//     headers.set('Accept-Language', 'en-US,en;q=0.9');
//     headers.set('Referer', 'https://www.google.com/');
//     headers.set('Sec-Fetch-Dest', 'document');
//     headers.set('Sec-Fetch-Mode', 'navigate');
//     headers.set('Sec-Fetch-Site', 'none');
//     headers.set('Upgrade-Insecure-Requests', '1');
//     headers.set('Cache-Control', 'no-cache');

//     const response = await fetch(url, {
//         method: 'GET',
//         headers: headers,
//         redirect: 'follow',
//     });
    
//     if (!response.ok) {
//         throw new Error(`Upstream ${response.status}: ${response.statusText}`);
//     }

//     const contentType = response.headers.get('content-type') || 'application/octet-stream';
//     res.setHeader('Content-Type', contentType);
//     res.setHeader('Access-Control-Allow-Origin', '*');
    
//     const arrayBuffer = await response.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
    
//     res.status(200).send(buffer);

//   } catch (error: any) {
//     console.error('Proxy Error:', error.message);
//     res.status(500).json({ error: 'Failed to fetch resource' });
//   }
// }










// import type { NextApiRequest, NextApiResponse } from 'next';
// import { Buffer } from 'buffer';

// export const config = {
//   api: {
//     responseLimit: false, 
//     bodyParser: false,
//   },
// };

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { url } = req.query;

//   if (!url || typeof url !== 'string') {
//     return res.status(400).json({ error: 'URL is required' });
//   }

//   try {
//     // Stealth Headers: Mimic a real Chrome browser
//     const headers = new Headers();
//     headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
//     headers.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8');
//     headers.set('Accept-Language', 'en-US,en;q=0.9');
//     headers.set('Referer', 'https://www.google.com/');
//     headers.set('Sec-Fetch-Dest', 'document');
//     headers.set('Sec-Fetch-Mode', 'navigate');
//     headers.set('Sec-Fetch-Site', 'none');
//     headers.set('Upgrade-Insecure-Requests', '1');
//     headers.set('Cache-Control', 'no-cache');

//     const response = await fetch(url, {
//         method: 'GET',
//         headers: headers,
//         redirect: 'follow',
//     });
    
//     if (!response.ok) {
//         throw new Error(`Upstream ${response.status}: ${response.statusText}`);
//     }

//     const contentType = response.headers.get('content-type') || 'application/octet-stream';
//     res.setHeader('Content-Type', contentType);
//     res.setHeader('Access-Control-Allow-Origin', '*');
    
//     const arrayBuffer = await response.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
    
//     res.status(200).send(buffer);

//   } catch (error: any) {
//     console.error('Proxy Error:', error.message);
//     res.status(500).json({ error: 'Failed to fetch resource' });
//   }
// }








// import type { NextApiRequest, NextApiResponse } from 'next';
// import { Buffer } from 'buffer';

// export const config = {
//   api: {
//     responseLimit: false, 
//     bodyParser: false,
//   },
// };

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { url } = req.query;

//   if (!url) {
//     return res.status(400).json({ error: 'URL is required' });
//   }

//   const targetUrl = Array.isArray(url) ? url[0] : url;

//   try {
//     // Fix for URLs with spaces or unescaped characters which node-fetch dislikes
//     // We utilize the URL object to normalize the string
//     const normalizedUrl = new URL(targetUrl).toString();

//     const response = await fetch(normalizedUrl, {
//       method: 'GET',
//       headers: {
//         // Mimic a real browser to bypass basic bot protection
//         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
//         'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
//         'Accept-Encoding': 'identity', // Disable compression to simplify relay
//       },
//       redirect: 'follow'
//     });

//     if (!response.ok) {
//       throw new Error(`Upstream error: ${response.status}`);
//     }

//     const contentType = response.headers.get('content-type') || 'application/octet-stream';
//     const arrayBuffer = await response.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     // Forward headers
//     res.setHeader('Content-Type', contentType);
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Cache-Control', 'public, max-age=86400');
    
//     res.status(200).send(buffer);

//   } catch (error: any) {
//     console.error("Proxy Error:", error.message, targetUrl);
//     res.status(500).json({ error: "Failed to fetch media", details: error.message });
//   }
// }











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