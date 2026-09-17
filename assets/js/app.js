document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://1-4-examen-tema-1-tendencias-actual.vercel.app';
    const apiService = new ApiService(API_URL);

    // Inicialización de componentes
    const chatModule = new ChatModule(apiService);
    new AudioModule(apiService);
    new DocumentModule(apiService);
    new ImageModule(apiService);

    // Evento del Chat respetando el selector
    const chatForm = document.getElementById('chat-form');
    if (chatForm) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = document.getElementById('chat-input');
            const directionSelect = document.getElementById('chat-direction');
            const text = input.value.trim();

            if (!text) return;

            // Lee estrictamente lo que el usuario seleccionó en el botón
            const [sourceLang, targetLang] = directionSelect.value === 'es-en' 
                ? ['Español', 'Inglés'] 
                : ['Inglés', 'Español'];

            try {
                // Envía el idioma de origen y destino seleccionados manualmente
                await chatModule.sendMessage(text, sourceLang, targetLang);
                input.value = '';
            } catch (err) {
                alert(err.message);
            }
        });
    }
});