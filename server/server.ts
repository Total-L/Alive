import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// 如果 index.ts 存在，使用 index.ts；否则使用 index.js
import router from './routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api', router);

app.get('/', (req, res) => {
    res.send('Alive Backend is running');
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;
