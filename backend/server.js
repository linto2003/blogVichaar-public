const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const useragent = require('express-useragent');
const cors = require('cors');

dotenv.config();
const app = express();

const allowedOrigins = [
  'https://blogvichaar.netlify.app',
  'http://localhost:5173'
];

// ✅ Apply CORS middleware BEFORE any routes
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, 
}));

app.options('*', cors());


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(useragent.express());
app.use(cookieParser());

mongoose.connect(process.env.mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


app.get('/', (req, res) => {
  res.send('Welcome to the Blog API');
});


const jwtAuthMiddleware = require('./services/jwt').jwtAuth;
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');

app.use('/auth', authRoutes);
app.use('/info', jwtAuthMiddleware, userRoutes);
app.use('/blog', blogRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API is running on http://localhost:${PORT}`);
});
