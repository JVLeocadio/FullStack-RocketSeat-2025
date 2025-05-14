import { initializeVideoPreview } from './preview.js';
import { initializeSidebar } from '../../src/components/sidebar.js';
import { initializeFilters } from './filters.js';
import { initializeTabs } from './tabs.js';
import { handleVideoUpload } from './upload.js';
import { fetchAndDisplayVideos } from './videoManager.js';

const seasonSelect = document.getElementById('season-select');
const mainVideo = document.getElementById('custom-video');
const monthSelect = document.getElementById('month-select');
const daySelect = document.getElementById('day-select');
const sessionList = document.getElementById('session-list');
const sessionTitle = document.getElementById('session-title');
const clipInfo = document.getElementById('clip-info');
const quarterInfo = document.getElementById('quarter-info');
const playTypeInfo = document.getElementById('play-type-info');
const videoList = document.getElementById('video-list');

// Inicializar funcionalidades
initializeSidebar();
initializeFilters();
initializeTabs();
initializeVideoPreview('video-file', 'video-preview');

// Buscar e exibir vídeos
document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayVideos(
        videoList,
        sessionList,
        mainVideo,
        sessionTitle,
        clipInfo,
        quarterInfo,
        playTypeInfo,
        document.getElementById('category-select'),
        seasonSelect,
        monthSelect,
        daySelect
    );
});

// Inicializar o formulário de upload
handleVideoUpload('upload-form', 'upload-status');