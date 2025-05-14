export function initializeVideoPreview(inputId, previewContainerId) {
    const inputElement = document.getElementById(inputId);
    const videoElement = document.getElementById('preview-video');
    const videoSource = document.getElementById('preview-video-source');
    const placeholder = document.getElementById('preview-placeholder');

    if (!inputElement || !videoElement || !videoSource) {
        console.error('Elemento de input ou player de vídeo não encontrado.');
        return;
    }

    inputElement.addEventListener('change', (event) => {
        const file = event.target.files[0];

        if (file) {
            const videoURL = URL.createObjectURL(file);
            videoSource.src = videoURL;
            videoElement.style.display = 'block';
            placeholder.style.display = 'none';
            videoElement.load();
        } else {
            videoSource.src = '';
            videoElement.style.display = 'none';
            placeholder.style.display = 'block';
        }
    });
}