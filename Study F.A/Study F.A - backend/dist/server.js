"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const pg_1 = require("pg");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Middleware para permitir requisições de outros domínios (CORS)
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Configuração do banco de dados PostgreSQL
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
// Configuração do multer para upload de arquivos
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(__dirname, '../uploads');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({ storage });
// Endpoint para upload de vídeos
app.post('/uploads', upload.single('video-file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { sessionType, season, tags, uploadMonth, uploadDay } = req.body;
    const videoPath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
    if (!videoPath) {
        return res.status(400).json({ message: 'Nenhum arquivo foi enviado.' });
    }
    try {
        yield pool.query('INSERT INTO videos (session_type, season, video_date, path, tags, upload_month, upload_day) VALUES ($1, $2, $3, $4, $5, $6)', [sessionType, season, videoPath, tags, uploadMonth, uploadDay]);
        res.status(200).json({ message: 'Vídeo enviado com sucesso!' });
    }
    catch (error) {
        console.error('Erro ao salvar o vídeo:', error);
        res.status(500).json({ message: 'Erro ao salvar o vídeo.' });
    }
    console.log('Dados recebidos para salvar no banco:', {
        sessionType,
        season,
        videoPath,
        tags,
        uploadMonth,
        uploadDay
    });
}));
// Endpoint para buscar vídeos
app.get('/videos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield pool.query('SELECT * FROM videos');
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Erro ao buscar vídeos:', error);
        res.status(500).json({ message: 'Erro ao buscar vídeos.' });
    }
}));
// Servir arquivos estáticos (vídeos)
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.get('/', (req, res) => {
    res.send('Backend funcionando!');
});
