import express from 'express';
import videoRoutes from './routes/videoRoutes';

const app = express();

app.use(express.json());
app.use('/uploads', express.static('uploads')); // Servir arquivos estáticos
app.use('/api', videoRoutes); // Registrar as rotas de vídeos

export default app;