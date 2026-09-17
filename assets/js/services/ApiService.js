class ApiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async postRequest(endpoint, payload, isFormData = false) {
        try {
            const options = { method: 'POST' };
            if (isFormData) {
                options.body = payload; // FormData maneja sus propios Headers
            } else {
                options.headers = { 'Content-Type': 'application/json' };
                options.body = JSON.stringify(payload);
            }

            const response = await fetch(`${this.baseUrl}${endpoint}`, options);
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
    // NÚEVO MÉTODO: Envia el FormData del audio al endpoint correspondiente
    async translateAudio(formData) {
        return await this.postRequest('/translate-audio', formData, true);
    }
}