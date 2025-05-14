import { Router } from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const router = Router();
const prisma = new PrismaClient();

// Certifique-se de que a pasta uploads existe
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir });

// Endpoint para upload de vídeos
router.post('/videos', upload.single('video'), async (req, res) => {
  const { title, tags } = req.body;
  const videoFile = req.file;

  if (!videoFile) {
    return res.status(400).json({ error: 'Nenhum vídeo enviado.' });
  }

  if (!title || !tags) {
    return res.status(400).json({ error: 'Título e tags são obrigatórios.' });
  }

  const extension = path.extname(videoFile.originalname);
  const newFilename = `${videoFile.filename}${extension}`;
  const newPath = path.join(videoFile.destination, newFilename);

  fs.renameSync(videoFile.path, newPath);

  try {
    const formattedTags = tags.split(',').map((tag: string) => tag.trim()).join(',');
    const video = await prisma.video.create({
      data: {
        tags: formattedTags,
        path: `/uploads/${newFilename}`,
        sessionType: 'default', // Adicione valores padrão se necessário
        season: 'default',
        videoDate: new Date(),
      },
    });

    res.status(201).json(video);
  } catch (error) {
    console.error('Erro ao salvar o vídeo:', error);
    res.status(500).json({ error: 'Erro interno ao salvar o vídeo.' });
  }
});

export default router;