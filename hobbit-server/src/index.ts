import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hobbit Server is running' });
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
