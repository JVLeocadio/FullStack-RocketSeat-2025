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
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Certifique-se de que a pasta uploads existe
const uploadDir = path_1.default.join(__dirname, '../../uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const upload = (0, multer_1.default)({ dest: uploadDir });
// Endpoint para upload de vídeos
router.post('/videos', upload.single('video'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, tags } = req.body;
    const videoFile = req.file;
    if (!videoFile) {
        return res.status(400).json({ error: 'Nenhum vídeo enviado.' });
    }
    if (!title || !tags) {
        return res.status(400).json({ error: 'Título e tags são obrigatórios.' });
    }
    const extension = path_1.default.extname(videoFile.originalname);
    const newFilename = `${videoFile.filename}${extension}`;
    const newPath = path_1.default.join(videoFile.destination, newFilename);
    fs_1.default.renameSync(videoFile.path, newPath);
    try {
        const formattedTags = tags.split(',').map((tag) => tag.trim()).join(',');
        const video = yield prisma.video.create({
            data: {
                tags: formattedTags,
                path: `/uploads/${newFilename}`,
                sessionType: 'default', // Adicione valores padrão se necessário
                season: 'default',
                videoDate: new Date(),
            },
        });
        res.status(201).json(video);
    }
    catch (error) {
        console.error('Erro ao salvar o vídeo:', error);
        res.status(500).json({ error: 'Erro interno ao salvar o vídeo.' });
    }
}));
exports.default = router;
