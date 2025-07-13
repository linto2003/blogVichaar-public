const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));  // For form data
app.use(bodyParser.json());                          // For JSON data
const jwtAuthMiddleware = require('./services/jwt').jwtAuth; // Import JWT authentication middleware
mongoose.connect(process.env.mongoURI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

app.get('/', (req, res) => {
    res.send('Welcome to the Blog API');
});

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');

app.use('/auth', authRoutes);
app.use('/info', jwtAuthMiddleware,userRoutes);
app.use('/blog', jwtAuthMiddleware, blogRoutes);

app.listen(3000, () => {
    console.log('API is running on http://localhost:3000');
});