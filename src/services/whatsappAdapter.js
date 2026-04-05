export const WhatsAppProviderAdapter = {
  sendText: async (destination, text, delay = 1000) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulando 90% de sucesso
        Math.random() > 0.1 ? resolve({ success: true, messageId: 'msg_' + Date.now() }) : reject(new Error('Falha na conexão com provider'));
      }, delay);
    });
  }
};
