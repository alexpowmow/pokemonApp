const mongoose = require('mongoose');

const pokemonMap = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    pokemonId:{
        type: Array,
        required: false
    }
});

module.exports = mongoose.model('pokemonMap', pokemonMap);