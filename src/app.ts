import cors from 'cors';
import express, { type Application } from 'express';

const app : Application  = express();

app.use(cors())
app.use(express.json());


export default app;