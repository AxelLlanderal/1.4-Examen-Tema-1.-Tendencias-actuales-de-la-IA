document.addEventListener('DOMContentLoaded', () => {
    // Reemplazar con la URL real desplegada en Vercel
    const API_URL = 'https://1-4-examen-tema-1-tendencias-actual.vercel.app/'; 
    const apiService = new ApiService(API_URL);

    // Inicializar módulo de Chat
    const chatModule = new ChatModule(apiService);

    const chatForm = document.getElementById('chat-form');
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
});