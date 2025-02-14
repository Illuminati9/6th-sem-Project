require('dotenv').config();
const express = require('express');
const app = express();
const dbConnect = require('./config/database.js');

dbConnect();

const PORT = process.env.PORT || 8000;

app.use(express.json());

const authRoutes = require('./routes/authRoutes');  
app.use('/api/auth/', authRoutes);

app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
});
