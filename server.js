const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
//const swaggerMain = require('routes/swagger.js');


mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const options = {
    definition:{
        openapi: "3.0.0",
        info:{
            title:"Pokemon API",
            version:"1.0.0",
            description:" A simple express library API"

        },
        servers:[
            {
                url:"http://localhost:5001"
            }
        ],
    },
        apis:["./routes/*.js"]
    
}

const specs = swaggerJsDoc(options);
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
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));



app.listen(5001, () => console.log('Server has started'));










