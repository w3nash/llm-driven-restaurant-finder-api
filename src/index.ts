    import express, { type Express, type Request, type Response } from 'express';
    import dotenv from 'dotenv';

    dotenv.config();

    const app: Express = express();
    const PORT = process.env['PORT'] || 3000;

    app.get('/', (req: Request, res: Response) => {
        res.send('Hello world!');
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });