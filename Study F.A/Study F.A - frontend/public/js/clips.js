export function loadClipsData(videoData, seasonSelect, monthSelect, daySelect, clipsTableBody) {
    const season = seasonSelect.value;
    const month = monthSelect.value;
    const day = daySelect.value;

    clipsTableBody.innerHTML = ''; // Limpar tabela

    if (videoData[season] && videoData[season][month] && videoData[season][month][day]) {
        videoData[season][month][day].forEach((session, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${session.quarter}</td>
                <td>${session.hash || '-'}</td>
                <td>${session.down || '-'}</td>
                <td>${session.distance || '-'}</td>
                <td>${session.playType}</td>
                <td>${session.gnLs || '-'}</td>
                <td>${session.turnover || '-'}</td>
            `;
            clipsTableBody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="8">Nenhum dado disponível para esta data.</td>`;
        clipsTableBody.appendChild(row);
    }
}