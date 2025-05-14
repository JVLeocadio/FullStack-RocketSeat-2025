const express = require('express');
const multer = require('multer');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware para permitir requisições de outros domínios (CORS)
app.use(cors());
app.use(express.json());

// Configuração do banco de dados PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// Endpoint para upload de vídeos
app.post('/uploads', upload.single('video-file'), async (req, res) => {
    const { sessionType, season, date, tags } = req.body;
    const videoPath = req.file.filename;

    try {
        await pool.query(
            'INSERT INTO videos (session_type, season, video_date, path, tags) VALUES ($1, $2, $3, $4, $5)',
            [sessionType, season, date, videoPath, tags]
        );
        res.status(200).json({ message: 'Vídeo enviado com sucesso!' });
    } catch (error) {
        console.error('Erro ao salvar o vídeo:', error);
        res.status(500).json({ message: 'Erro ao salvar o vídeo.' });
    }
});

// Endpoint para buscar vídeos
app.get('/videos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM videos');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar vídeos:', error);
        res.status(500).json({ message: 'Erro ao buscar vídeos.' });
    }
});

// Servir arquivos estáticos (vídeos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Iniciar o servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));