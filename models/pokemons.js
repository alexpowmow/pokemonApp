const mongoose = require('mongoose');

const pokemonSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    element:{
        type: String,
        required: true
    },
    attack:{
        type: String,
        required: true
    },
    health:{
        type: Number,
        required: true
    },
    weakness:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('pokemon', pokemonSchema);