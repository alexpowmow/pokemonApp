const express = require('express');
const router = express.Router();
const Pokemon = require('../models/pokemons.js');

router.get('/', async (req, res) => {
try{
    const pokemons = await Pokemon.find();
    res.send(pokemons);
} catch (err) {
 res.status(500).json({message: err.message});
}
});

router.get('/:id', getPokemon, (req, res) => {
    res.json(res.pokemon);
});

router.post('/', async (req, res) => {
    const pokemon = new Pokemon({
        name: req.body.name,
        element: req.body.element,
        attack: req.body.attack,
        health: req.body.health,
        weakness: req.body.weakness
    });

    try{
        const newPokemon = await pokemon.save();
        res.status(201).json(newPokemon);
    } catch(err){
        res.status(400).json({ message: err.message});
    }
});

router.patch('/:id', getPokemon, async(req, res) => {
    if(req.body.name != null){
        res.pokemon.name = req.body.name;
    }
    if(req.body.element != null){
        res.pokemon.element = req.body.element;
    }
    if(req.body.attack != null){
        res.pokemon.attack = req.body.attack;
    }
    if(req.body.health != null){
        res.pokemon.health= req.body.health;
    }
    if(req.body.weakness != null){
        res.pokemon.weakness = req.body.weakness;
    }

    try{
        const updatedPokemon = await res.pokemon.save();
        res.json(updatedPokemon);
    } catch(err){
        res.status(400).json({message: err.message})
    }
});


router.delete('/:id', getPokemon, async (req, res) => {
    try{
        await res.pokemon.remove();
        res.send('Item deleted');
    } catch(err){
        res.status(500).json({message: err.message});
    }
});

async function getPokemon(req, res, next){
    try{
        pokemon = await Pokemon.findById(req.params.id);
        if(pokemon == null){
            return res.status(404).json({message:'Cannot find Pokemon'});
        }
    } catch (err) {
        return res.status(500).json({message: err.message});
    }

    res.pokemon = pokemon;
    next();
}

module.exports = router;