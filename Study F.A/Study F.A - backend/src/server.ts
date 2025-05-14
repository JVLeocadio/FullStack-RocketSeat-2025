import express from 'express';
import multer from 'multer';
import { Pool } from 'pg';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Configuração do banco de dados PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, './uploads');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

app.post('/uploads', upload.single('video-file'), async (req, res) => {
    // Logar os dados recebidos
    console.log('Dados recebidos do frontend:', req.body); // Verifique o corpo da requisição
    console.log('Arquivo recebido:', req.file); // Verifique o arquivo de vídeo enviado

    // Extraindo os dados do corpo da requisição
    const { sessionType, season, tags, uploadMonth, uploadDay, playType, playName } = req.body;
    const videoPath = req.file?.filename;

    if (!videoPath) {
        return res.status(400).json({ message: 'Nenhum arquivo foi enviado.' });
    }

    let videoDate: Date;

    // Verificando e formatando a data
    if (uploadMonth && uploadDay) {
        const currentYear = new Date().getFullYear();
        videoDate = new Date(`${currentYear}-${uploadMonth.padStart(2, '0')}-${uploadDay.padStart(2, '0')}`);
    } else {
        videoDate = new Date(); // Caso a data não seja fornecida, usamos a data atual
    }

    // Logando os dados que serão inseridos
    console.log('Dados para Inserção no Banco:', {
        sessionType, 
        season, 
        videoPath, 
        tags, 
        uploadMonth, 
        uploadDay, 
        playType, 
        playName, 
        videoDate
    });

    try {
        // Inserindo os dados na tabela
        await pool.query(
            'INSERT INTO videos (session_type, season, path, tags, upload_month, upload_day, play_type, play_name, video_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [sessionType, season, videoPath, tags, parseInt(uploadMonth), parseInt(uploadDay), playType, playName, videoDate]
        );

        // Sucesso no upload
        console.log('Vídeo enviado com sucesso e informações salvas na tabela!');
        res.status(200).json({ message: 'Vídeo enviado com sucesso!' });

    } catch (error) {
        // Log de erro
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
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Backend funcionando!');
});

// Endpoint para filtrar vídeos
app.get('/filter-videos', async (req, res) => {
    const { sessionType, season, uploadMonth } = req.query;

    let query = 'SELECT * FROM videos WHERE 1=1';
    const queryParams: any[] = [];

    if (sessionType) {
        query += ' AND session_type = $1';
        queryParams.push(sessionType);
    }
    if (season) {
        query += ' AND season = $2';
        queryParams.push(season);
    }
    if (uploadMonth) {
        query += ' AND upload_month = $3';
        queryParams.push(uploadMonth);
    }

    try {
        const result = await pool.query(query, queryParams);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao filtrar vídeos:', error);
        res.status(500).json({ message: 'Erro ao filtrar vídeos.' });
    }
});
