const express = require('express');
const connectDB = require('./config/db');
const expHbs = require('express-handlebars');
const homeRouter = require('./routes/home');
const fileRouter = require('./routes/files');
const showRouter = require('./routes/show');
const downloadRouter = require('./routes/download');
const authRouter = require('./routes/auth');

const app = express();
connectDB();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Template engine
app.engine('hbs', expHbs({ extname: 'hbs' }));
app.set('view engine', 'hbs');
// Routes
app.use('/', homeRouter);
app.use('/api/files', fileRouter);
app.use('/api/users', authRouter);
app.use('/files', showRouter);
app.use('/files/download', downloadRouter);

app.all('*', (req, res) => {
  res.render('error');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
