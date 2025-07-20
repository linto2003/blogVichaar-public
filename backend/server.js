const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const useragent = require('express-useragent');
dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));  // For form data
app.use(bodyParser.json());   // For JSON data
app.use(useragent.express());
app.use(cookieParser());

const cors = require('cors');
// app.use(cors({
//   origin:['http://localhost:5173','https://b5jf25nx-5173.inc1.devtunnels.ms'] ,
//   credentials: true,
// }));


const allowedOrigins = ['https://b5jf25nx-5173.inc1.devtunnels.ms','http://localhost:5173'];
        
app.use(cors({
          origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
              const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
              return callback(new Error(msg), false);
            }
            return callback(null, true);
          },
          credentials: true // if your requests need credentials (cookies, authorization headers)
        }));

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
app.use('/blog', blogRoutes);

app.listen(3000, () => {
    console.log('API is running on http://localhost:3000');
});