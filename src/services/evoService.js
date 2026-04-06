export const EvoService = {
  // Use Vercel Proxy to bypass CORS
  getConnectionState: async (url, instance, apikey) => {
    try {
      const query = new URLSearchParams({ url, instance, apikey });
      const response = await fetch(`/api/evo-proxy?${query.toString()}`, {
        method: 'GET'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
        throw new Error(errorData.error || errorData.message || `Erro ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('EvoService Proxy Error:', error);
      throw error;
    }
  },

  getQrCode: async (url, instance, apikey) => {
    try {
      const query = new URLSearchParams({ 
        url, 
        instance, 
        apikey, 
        path: `instance/connect/${instance}` 
      });
      const response = await fetch(`/api/evo-proxy?${query.toString()}`, {
        method: 'GET'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
        throw new Error(errorData.error || errorData.message || `Erro ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('EvoService QR Proxy Error:', error);
      throw error;
    }
  }
};
