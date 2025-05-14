export function updateSessions(videoData, seasonSelect, monthSelect, daySelect, sessionList, mainVideo, sessionTitle, clipInfo, quarterInfo, playTypeInfo) {
    const season = seasonSelect.value;
    const upload_month = monthSelect.value;
    const upload_day = daySelect.value;

    // Limpar lista de sessões
    sessionList.innerHTML = "";

    // Verificar se há dados para a temporada, mês e dia selecionados
    if (videoData[season] && videoData[season][upload_month] && videoData[season][upload_month][upload_day ]) {
        videoData[season][upload_month][upload_day ].forEach(session => {
            const sessionDiv = document.createElement('div');
            sessionDiv.classList.add('session');
            sessionDiv.textContent = `${session.sessionType}: ${session.session}`; // Exibe o tipo de sessão

            // Criar lista de vídeos dentro da sessão
            const videoList = document.createElement('ul');
            videoList.style.marginTop = "10px";
            videoList.style.paddingLeft = "20px";

            session.videos.forEach(video => {
                const videoItem = document.createElement('li');
                videoItem.textContent = video.title;
                videoItem.style.cursor = "pointer";
                videoItem.style.color = "#1f8ef1";

                // Adicionar evento de clique para carregar o vídeo
                videoItem.addEventListener('click', () => {
                    mainVideo.querySelector('source').src = video.src;
                    mainVideo.load();
                    mainVideo.play();

                    // Atualizar informações do vídeo
                    sessionTitle.textContent = session.session;
                    clipInfo.textContent = `Clip: ${session.clip}`;
                    quarterInfo.textContent = `Quarter: ${session.quarter}`;
                    playTypeInfo.textContent = `Play Type: ${session.playType}`;
                });

                videoList.appendChild(videoItem);
            });

            sessionDiv.appendChild(videoList);
            sessionList.appendChild(sessionDiv);
        });
    
    }}