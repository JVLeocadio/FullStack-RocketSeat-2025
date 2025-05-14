// filepath: c:\Users\LEOCADIO\Documents\leocadio\projetos\Study F.A\Study F.A - frontend\public\js\fetchVideos.js
export async function fetchVideos() {
    try {
        const response = await fetch('http://localhost:4000/videos');
        const videos = await response.json();

        const videoList = document.getElementById('video-list');
        videoList.innerHTML = '';

        videos.forEach(video => {
            const videoItem = document.createElement('div');
            videoItem.classList.add('video-item');
            videoItem.innerHTML = `
                <video controls>
                    <source src="http://localhost:4000/uploads/${video.path}" type="video/mp4">
                    Seu navegador não suporta o elemento de vídeo.
                </video>
                <p><strong>Session:</strong> ${video.session_type}</p>
                <p><strong>Season:</strong> ${video.season}</p> 
                <p><strong>Tags:</strong> ${video.tags}</p>
            `;
            videoList.appendChild(videoItem);
        });
    } catch (error) {
        console.error('Erro ao buscar vídeos:', error);
    }
}