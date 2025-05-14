"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Lógica de autenticação
    res.json({ token: 'jwt-token-aqui' });
});
router.get('/profile', (req, res) => {
    // Retorna informações do usuário autenticado
    res.json({ id: 1, name: 'John Doe', email: 'john.doe@example.com' });
});
exports.default = router;
