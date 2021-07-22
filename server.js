const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'));


app.use(express.json());

const pokemonRouter = require('./routes/pokemon');
const userRouter = require('./routes/user');
const mapRouter = require('./routes/map');

app.use('/pokemon', pokemonRouter);
app.use('/user', userRouter);
app.use('/map', mapRouter);



app.listen(5001, () => console.log('Server has started'));