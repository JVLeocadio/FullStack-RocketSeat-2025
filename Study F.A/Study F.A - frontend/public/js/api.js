const BACKEND_URL = 'http://localhost:4000'; // URL do backend

export async function uploadVideo(formData) {
    try {
        const response = await fetch(`${BACKEND_URL}/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar o vídeo.');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro na API de upload:', error);
        throw error;
    }
}



