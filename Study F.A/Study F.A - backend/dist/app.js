"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const videoRoutes_1 = __importDefault(require("./routes/videoRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static('uploads')); // Servir arquivos estáticos
app.use('/api', videoRoutes_1.default); // Registrar as rotas de vídeos
exports.default = app;
