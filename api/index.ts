import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import utmifyRouter from './routes/utmify';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/utmify', utmifyRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Servidor rodando na rota principal! 🚀');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}.`);
});
