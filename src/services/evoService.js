export const EvoService = {
  getConnectionState: async (url, instance, apikey) => {
    try {
      const response = await fetch(`${url}/instance/connectionState/${instance}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': apikey
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        throw new Error(errorData.message || `Erro ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('EvoService Error:', error);
      throw error;
    }
  },

  getQrCode: async (url, instance, apikey) => {
    try {
      const response = await fetch(`${url}/instance/connect/${instance}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': apikey
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        throw new Error(errorData.message || `Erro ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('EvoService QR Error:', error);
      throw error;
    }
  }
};
