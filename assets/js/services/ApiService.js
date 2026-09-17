class ApiService {
    // URL base de tu backend Flask
    static BASE_URL = 'http://127.0.0.1:5000'; // Cambia esta URL por la de tu backend (ej. Render/Vercel)

    static async postRequest(endpoint, payload, isFormData = false) {
        try {
            const options = { method: 'POST' };
            
            if (isFormData) {
                options.body = payload; // FormData maneja sus propios Headers
            } else {
                options.headers = { 'Content-Type': 'application/json' };
                options.body = JSON.stringify(payload);
            }

            const response = await fetch(`${this.BASE_URL}${endpoint}`, options);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error en la respuesta del servidor');
            }
            return data;
        } catch (error) {
            console.error('Error ApiService:', error);
            throw new Error(error.message || 'Error de conexión con el backend');
        }
    }

    // Método estático para traducir audio grabado o subido
    static async translateAudio(formData) {
        return await this.postRequest('/translate-audio', formData, true);
    }
}