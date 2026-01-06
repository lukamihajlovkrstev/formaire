import { ApiResponse } from '@formaire/shared';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  const response: ApiResponse = {
    message: 'Hello from the backend',
    timestamp: new Date(),
  };
  res.json(response);
});

app.listen(4000, () => {
  console.log('Backend running on http://localhost:4000');
});
