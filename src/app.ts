import express from 'express';
import bookHandler from './modules/book/book.controller';
import borrowHandler from './modules/borrow/borrow.controller';

const app = express();

app.use(express.json());
app.use('/api', bookHandler);
app.use('/api', borrowHandler);

export default app;
