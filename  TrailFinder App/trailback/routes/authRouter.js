import express from 'express';
import jwt from 'jsonwebtoken';
import loadEnvFile from '../utils/envUtil.js';
import * as authService from '../services/authService.js';

const envVariables = loadEnvFile('./.env');

const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const registerResult = await authService.registerUser(name, email.toLowerCase(), password);
    if (registerResult) {
        console.log(`User ${name} successfully registered - 200`);
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false, error: 'Failed to register' });
    }
});

// User login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const loginResult = await authService.loginUser(email.toLowerCase(), password);
    if (loginResult) {
        console.log('User successfully logged in via password - 200');
        res.json({ success: true, token: loginResult });
    } else {
        res.status(400).json({ error: "Login failed" });
    }
});

// User login with Google
router.post('/google-login', async (req, res) => {
    const { token } = req.body;
    const googleResult = await authService.googleLogin(token);
    if (googleResult) {
        console.log('User successfully logged in via google - 200');
        res.json({ success: true, token: googleResult });
    } else {
        res.status(500).json({ success: false, error: 'Google LoginPage Failed' });
    }
});

// Verify authentication token
router.get('/verify-token', authenticateToken, (req, res) => {
    const { userId } = req.user;
    res.json({ valid: true, userId: userId });
});

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, envVariables["JWT_SECRET"], (err, user) => {
        if (err) return res.sendStatus(403);

        req.user = user;
        next();
    });
}

export default router;