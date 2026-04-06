// Vercel Serverless Function: Proxy Evolution API to bypass CORS
export default async function handler(req, res) {
  const { url, instance, apikey, path, method = 'GET' } = req.query;

  if (!url || !instance || !apikey) {
    return res.status(400).json({ error: 'Missing parameters (url, instance, or apikey)' });
  }

  // Common Evolution API endpoint pattern can be overridden by 'path' query param
  const targetPath = path || `instance/connectionState/${instance}`;
  const targetUrl = `${url}${url.endsWith('/') ? '' : '/'}${targetPath}`;

  try {
    const response = await fetch(targetUrl, {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'apikey': apikey
      },
      // Pass-through body if it's a POST/PUT
      body: (method === 'POST' || method === 'PUT') ? JSON.stringify(req.body) : undefined
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Evolution Proxy Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
