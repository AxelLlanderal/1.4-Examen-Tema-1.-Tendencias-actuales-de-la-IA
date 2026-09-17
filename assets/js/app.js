document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://1-4-examen-tema-1-tendencias-actual.vercel.app';
    const apiService = new ApiService(API_URL);

    // Inicialización de componentes POO
    const chatModule = new ChatModule(apiService);
    new AudioModule(apiService);
    new DocumentModule(apiService);
    new ImageModule(apiService);

    // Evento del Chat con Detección Automática Inteligente
    const chatForm = document.getElementById('chat-form');
    if (chatForm) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = document.getElementById('chat-input');
            const text = input.value.trim();

            if (!text) return;

            // Detecta si el texto ingresado tiene palabras o caracteres comunes en español
            const containsSpanish = /[áéíóúñ¿¡]/i.test(text) || /\b(hola|que|como|estas|bien|gracias|soy)\b/i.test(text);
            
            // Asigna dinámicamente el idioma de origen y destino
            const sourceLang = containsSpanish ? 'Español' : 'Inglés';
            const targetLang = containsSpanish ? 'Inglés' : 'Español';

            try {
                // Envía la solicitud de traducción
                await chatModule.sendMessage(text, 'Auto', targetLang);
                
                // Actualiza la tarjeta con el idioma real detectado (Azul para ES, Verde para EN)
                if (chatModule.chatHistory.length > 0) {
                    chatModule.chatHistory[chatModule.chatHistory.length - 1].lang = sourceLang;
                    chatModule.render();
                }

                input.value = '';
            } catch (err) {
                alert(err.message);
            }
        });
    }
});