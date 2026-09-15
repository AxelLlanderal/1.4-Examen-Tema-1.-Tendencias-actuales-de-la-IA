document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://1-4-examen-tema-1-tendencias-actual.vercel.app';
    const apiService = new ApiService(API_URL);

    // Inicialización de componentes POO
    const chatModule = new ChatModule(apiService);
    new AudioModule(apiService);
    new DocumentModule(apiService);
    new ImageModule(apiService);

    // Evento del Chat
    const chatForm = document.getElementById('chat-form');
    if (chatForm) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = document.getElementById('chat-input');
            const direction = document.getElementById('chat-direction').value;
            const text = input.value;

            const [sourceLang, targetLang] = direction === 'es-en' 
                ? ['Español', 'Inglés'] 
                : ['Inglés', 'Español'];

            try {
                await chatModule.sendMessage(text, sourceLang, targetLang);
                input.value = '';
            } catch (err) {
                alert(err.message);
            }
        });
    }
});