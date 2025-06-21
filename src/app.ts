import express,{Request,Response} from 'express';
import bookHandler from './modules/book/book.controller';
import borrowHandler from './modules/borrow/borrow.controller';

const app = express();

app.use(express.json());
app.use('/api', bookHandler);
app.use('/api', borrowHandler);

app.get('/',async (req: Request, res: Response): Promise<void> => {
    res.status(201).json("Hello World")
})

export default app;
