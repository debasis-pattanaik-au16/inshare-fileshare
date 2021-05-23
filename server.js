const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');
const fileRouter = require('./routes/files');
const showRouter = require('./routes/show');
const downloadRouter = require('./routes/download');

const app = express();
connectDB();

// Cors
const corsOptions = {
  origin: process.env.ALLOWED_CLIENTS,
};

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

// Template engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
// Routes
app.use('/api/files', fileRouter);
app.use('/files', showRouter);
app.use('/files/download', downloadRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
