import { handler as ssrHandler } from './dist/server/entry.mjs';
import express from 'express';

const app = express();
app.use(express.static('dist/client/'));
app.use(ssrHandler);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
