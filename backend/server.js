import dotenv from 'dotenv';
import express from 'express';
import dbConnect from './config/database.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
dbConnect();
const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.json());

// const authRoutes = require('./routes/authRoutes');  
app.use('/api/auth/', authRoutes);

app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
});
