import dotenv from 'dotenv';
dotenv.config();

import app from './app'
import mongoose from 'mongoose'

async function bootstrap() {

   await mongoose.connect(process.env.DATABASE_URL!);
  console.log('Database connected');

  app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
  });
}

bootstrap();
