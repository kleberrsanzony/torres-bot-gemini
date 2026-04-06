// Vercel Serverless Function: Proxy Evolution API to bypass CORS
export default async function handler(req, res) {
  const { url, instance, apikey, path, method = 'GET' } = req.query;

  if (!url || !instance || !apikey) {
    return res.status(400).json({ error: 'Faltam parâmetros (url, instance ou apikey)' });
  }

  // Common Evolution API endpoint pattern can be overridden by 'path' query param
  const targetPath = path || `instance/connectionState/${instance}`;
  
  // Robust trailing slash handling
  const cleanUrl = url.replace(/\/+$/, '');
  const cleanPath = targetPath.replace(/^\/+/, '');
  const targetUrl = `${cleanUrl}/${cleanPath}`;

  try {
    const fetchOptions = {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'apikey': apikey
      }
    };

    // Pass-through body if it's a POST/PUT
    if ((method === 'POST' || method === 'PUT') && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: data.message || `Erro da Evolution API: ${response.status}`, 
        details: data 
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Evolution Proxy Runtime Error:', error);
    return res.status(500).json({ error: 'Erro de Servidor na Vercel', details: error.message });
  }
}
