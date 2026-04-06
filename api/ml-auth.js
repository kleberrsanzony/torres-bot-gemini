// Vercel Serverless Function: Exchange ML Code for Access Token
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, clientId, clientSecret, redirectUri } = req.body;

  if (!code || !clientId || !clientSecret || !redirectUri) {
    return res.status(400).json({ error: 'Faltam parâmetros (code, clientId, clientSecret ou redirectUri)' });
  }

  try {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      redirect_uri: redirectUri
    });

    const response = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString() // Node.js fetch needs stringified body for urlencoded
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('ML API Error:', data);
      return res.status(response.status).json({ 
        error: data.message || data.error || 'Erro na resposta do Mercado Livre',
        details: data 
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('ML Auth Proxy Runtime Error:', error);
    return res.status(500).json({ error: 'Erro interno no servidor Vercel', details: error.message });
  }
}
