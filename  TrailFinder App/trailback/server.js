import express from 'express';
import cors from 'cors';
import dataRouter from './routes/dataRouter.js';
import authRouter from './routes/authRouter.js';
import loadEnvFile from './utils/envUtil.js';
import userRouter from './routes/userRouter.js';
import ugcRouter from './routes/ugcRouter.js'

// Load environment variables from .env file
// Ensure your .env file has the required database credentials.
const envVariables = loadEnvFile('./.env');

const app = express();
const PORT = envVariables.PORT || 65534;  // Adjust the PORT if needed (e.g., if you encounter a "port already occupied" error)

// Middleware setup
// app.use(express.static('public'));  // Serve static files from the 'public' directory
app.use(express.json());             // Parse incoming JSON payloads
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    res.json('backend running');
});


// mount the router
app.use('/', dataRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/ugc', ugcRouter);


// ----------------------------------------------------------
// Starting the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
