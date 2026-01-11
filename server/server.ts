import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
// 如果 index.ts 存在，使用 index.ts；否则使用 index.js
import router from './routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use('/api', router);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, '../dist');
    app.use(express.static(distPath));

    // Handle SPA routing
    app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('Alive Backend is running');
    });
}

// For Vercel, we export the app. For other environments (like Zeabur/Local), we listen.
if (process.env.NODE_ENV !== 'test') { // Adjust condition as needed, usually simply listen if not imported
    // Check if run directly
    import('url').then(({ fileURLToPath }) => {
        const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
        // Simple heuristic: if we are in production (Zeabur uses npm start -> node server), or dev.
        // Vercel imports it.
        // A safer way: Vercel doesn't run "npm start". Zeabur does.
        // So we can listen if PORT is defined OR simply listen.
        // However, Vercel Serverless throws if we listen.
        // Let's rely on Vercel's behavior of importing.
        // But here we want a unified file.
        // Solution: Only listen if not on Vercel (VERCEL env var is not set)
        if (!process.env.VERCEL) {
             app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        }
    });
}

export default app;
