import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { router } from './routers/index.ts';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

app.set('strict routing', true);
app.set('strict query parsing', true);

const PORT = 5179;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
