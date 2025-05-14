import { updateSessions } from './sessions.js';

export async function fetchAndDisplayVideos(
    videoList,
    sessionList,
    mainVideo,
    sessionTitle,
    clipInfo,
    quarterInfo,
    playTypeInfo,
    categorySelect,
    seasonSelect,
    monthSelect,
    daySelect
) {
    let videos = [];

    // Buscar vídeos do servidor
    async function fetchVideos() {
        try {
            const response = await fetch('http://localhost:4000/videos  ');
            videos = await response.json();
            populateFilters(videos); // Popular os filtros com base nos vídeos
            filterVideos(); // Filtrar vídeos ao carregar
        } catch (error) {
            console.error('Erro ao buscar vídeos:', error);
        }
    }

    // Popular os filtros com base nos vídeos
    function populateFilters(videos) {
        const sessionTypes = new Set();
        const seasons = new Set();
        const uploadMonth = new Set();
        const uploadDay = new Set();
        

        videos.forEach((video) => {
            sessionTypes.add(video.session_type);
            seasons.add(video.season);
            uploadMonth.add(video.upload_month);
            uploadDay.add(video.upload_day);
            
          
        });

        // Popular o filtro de categorias
        categorySelect.innerHTML = Array.from(sessionTypes)
            .map((type) => `<option value="${type}">${type}</option>`)
            .join('');

        // Popular o filtro de temporadas
        seasonSelect.innerHTML = Array.from(seasons)
            .map((season) => `<option value="${season}">${season}</option>`)
            .join('');

        // Popular o filtro de meses
        monthSelect.innerHTML = Array.from(uploadMonth)
            .map((month) => `<option value="${month}">${month}</option>`)
            .join('');

        // Popular o filtro de dias
        daySelect.innerHTML = Array.from(uploadDay)
            .map((day) => `<option value="${day}">${day}</option>`)
            .join('');

            
    }


    // Filtrar vídeos com base nos filtros selecionados
    function filterVideos() {
        const selectedCategory = categorySelect.value;
        const selectedSeason = seasonSelect.value;
        const selectedMonth = monthSelect.value;
        const selectedDay = parseInt(daySelect.value, 10);
    
        const filteredVideos = videos.filter((video) => {
            return (
                video.session_type === selectedCategory&&
                video.season === selectedSeason &&
                video.upload_month === selectedMonth &&
                video.upload_day === selectedDay
            );
        });
    
        console.log('Vídeos filtrados:', filteredVideos);
    
        // Atualizar a lista de vídeos
        renderVideoList(filteredVideos);
    
        // Atualizar a lista de sessões
        const videoData = organizeVideosBySession(filteredVideos);
        updateSessions(videoData, seasonSelect, monthSelect, daySelect, sessionList, mainVideo, sessionTitle, clipInfo, quarterInfo, playTypeInfo);
    }


    // Renderizar a lista de vídeos
    function renderVideoList(filteredVideos) {
        videoList.innerHTML = '';

        if (filteredVideos.length === 0) {
            videoList.innerHTML = '<p>Nenhum vídeo encontrado para os filtros selecionados.</p>';
            return;
        }

        filteredVideos.forEach((video) => {
            const videoItem = document.createElement('a');
            videoItem.classList.add('video-item');
            videoItem.textContent = video.path; // Exibe o nome do vídeo
            videoItem.href = '#';

            videoItem.addEventListener('click', (e) => {
                e.preventDefault();
                mainVideo.querySelector('source').src = `http://localhost:4000/uploads/${video.path}`;
                mainVideo.load();
                mainVideo.play();
            });

            if (filteredVideos.length === 0) {
                videoList.innerHTML = '<p>Nenhum vídeo encontrado para os filtros selecionados.</p>';
                return;
            }
    
        });
    }

   function organizeVideosBySession(filteredVideos) {
    const videoData = {};

    filteredVideos.forEach((video) => {
        const season = video.season;
        const month = video.upload_month.toLowerCase();
        const day = video.upload_day;

        if (!videoData[season]) videoData[season] = {};
        if (!videoData[season][month]) videoData[season][month] = {};
        if (!videoData[season][month][day]) videoData[season][month][day] = [];

        videoData[season][month][day].push({
            session: video.session_type,
            clip: video.clip || 0,
            quarter: video.quarter || 'N/A',
            playType: video.play_type || 'N/A',
            videos: [
                {
                    title: video.path,
                    src: `http://localhost:4000/uploads/${video.path}`,
                },
            ],
        });
    });

    return videoData;
}


function updateSeasonOptions() {
    const selectedCategory = categorySelect.value;
    const seasons = new Set();

    videos.forEach((video) => {
        if (video.session_type === selectedCategory) {
            seasons.add(video.season);
        }
    });

    seasonSelect.innerHTML = '<option value="">-- Temporada --</option>' +
        Array.from(seasons).map(season => `<option value="${season}">${season}</option>`).join('');

    // Resetar os filtros abaixo do nível atual
    monthSelect.innerHTML = '<option value="">-- Mês --</option>';
    daySelect.innerHTML = '<option value="">-- Dia --</option>';
    videoList.innerHTML = '';
}



function updateMonthOptions() {
    const selectedCategory = categorySelect.value;
    const selectedSeason = seasonSelect.value;
    const months = new Set();

    videos.forEach((video) => {
        if (
            video.session_type === selectedCategory &&
            video.season === selectedSeason
        ) {
            months.add(video.month);
        }
    });

    monthSelect.innerHTML = '<option value="">-- Mês --</option>' +
        Array.from(months).map(month => `<option value="${month}">${month}</option>`).join('');

    // Resetar selects e lista abaixo do nível atual
    daySelect.innerHTML = '<option value="">-- Dia --</option>';
    videoList.innerHTML = '';
}



function updateDayOptions() {
    const selectedCategory = categorySelect.value;
    const selectedSeason = seasonSelect.value;
    const selectedMonth = monthSelect.value;
    const days = new Set();

    videos.forEach((video) => {
        if (
            video.session_type === selectedCategory &&
            video.season === selectedSeason &&
            video.month == selectedMonth
        ) {
            days.add(video.day);
        }
    });

    daySelect.innerHTML = '<option value="">-- Dia --</option>' +
        Array.from(days).map(day => `<option value="${day}">${day}</option>`).join('');

    videoList.innerHTML = '';
}






// Eventos
categorySelect.addEventListener('change', updateSeasonOptions);
seasonSelect.addEventListener('change', updateMonthOptions);
monthSelect.addEventListener('change', updateDayOptions);
daySelect.addEventListener('change', filterVideos);

// Iniciar
fetchVideos();
}