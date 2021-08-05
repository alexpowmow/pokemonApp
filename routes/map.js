const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pokemonMap = require('../models/pokemonMap.js');
const User = require('../models/users.js');
const pokemons = require('../models/pokemons.js');
ObjectId = require('mongodb').ObjectID;

/**
 * @swagger
 * paths:
 *  /map:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Returns all users and their corresponding pokemon
 *     tags: [Map]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/Map'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *        
 *      
 *         
 *     
 * 
*/

/**
 * @swagger
 * paths:
 *  /map/{id}:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Returns a single user and their corresponding pokemon
 *     tags: [Map]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/Map'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *        
 *      
 *         
 *     
 * 
*/


/**
 * @swagger
 * paths:
 *  /map:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Used to post a pokemon (by ID) to a user
 *     tags: [Map]
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *          schema:
 *            type: Array
 *            description: A list of pokemon Ids to add
 *            example:
 *                pokemonIds: [nj32l56kj2o43k5j6l3k, l2jk3456o2k34j565, o24k5j63oi45j6]
 * 
 *     responses:
 *       201:
 *         $ref: '#/components/responses/CreatedResource'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *        
 *      
 *         
 *     
 * 
*/

/**
 * @swagger
 * paths:
 *  /map/{id}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     summary: Deletes a pokemon from the users collection with given pokemon ID
 *     tags: [Map]
 *     parameters:
 *      - in: path
 *        name: id
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *        
 *      
 *         
 *     
 * 
*/


router.post('/', authenticateToken, async (req, res) => {
const userId = req.user.id;
const newPokemon = req.body.pokemonId;
const updatedPokemonArray = await checkPokemon(newPokemon);
console.log(userId);

try{
const existingPokemonUser = await pokemonMap.findOne({userId: userId }, function (err, Pokemonuser) {
    if (err){
        return res.status(404).json({message:'Cannot find User'});
    }
    else{
        console.log(Pokemonuser);
        return Pokemonuser;
    }
});
const _id = existingPokemonUser._id;
//console.log(_id);
if(updatedPokemonArray.length == 0){
    return res.status(404).json({message:'All pokemon IDs provided were invalid'});
}
await pokemonMap.updateOne({_id}, {$push:{pokemonId: updatedPokemonArray}});
res.status(201).json(existingPokemonUser);

    }catch(err){
        res.status(400).json({ message: err.message});
    }
   console.log(updatedPokemonArray);
});

router.get('/', authenticateToken, async(req, res) =>{
    try{
        const pokemonMap1 = await pokemonMap.find();
        res.send(pokemonMap1);
    } catch (err) {
     res.status(500).json({message: err.message});
    }
})

router.get('/:id', authenticateToken, async(req, res) =>{
    try{
        const existingPokemonUser = await pokemonMap.findOne({userId: req.params.id }, function (err, Pokemonuser) {
            if (err){
                return res.status(404).json({message:'Cannot find User'});
            }
            else{
                res.status(200).json(Pokemonuser);
                return Pokemonuser;
            }

        });
    }catch(err){
        res.status(400).json({ message: err.message});
    }
    
});

router.delete('/:id', authenticateToken, async(req, res) =>{
    try{
        const removePokemon = req.params.id;
        const user = req.user;
        const userId = user.id;
        const userMap = await pokemonMap.findOne({userId: userId}).lean();
        
        const _id = userMap.id;
        console.log(_id);
        if(user == null){
            return res.status(404).json({message:'Cannot find User'});
        }
        if(userMap == null){
            return res.status(404).json({message:'Cannot find UserMap'});
        }
        console.log(user);
        console.log(userMap);
        await pokemonMap.updateOne({id: _id}, {$pull: {pokemonId: removePokemon}});
        
        
        res.status(200).json({status: `Pokemon with id ${removePokemon} has been removed from your profile`});
    } catch(err){
        res.status(500).json({message: err.message});
    }
});

function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null){
        return res.sendStatus(401);
    };
        jwt.verify(token, process.env.JWT_SECRET, (err,user) => {
            if(err){
                return res.sendStatus(403);
            }
            //res.json({status:"Success"});
            req.user = user;
            next();
        })
    
};

async function checkPokemon(pokemonArray){

try{
var pokemonArray1 = [];
pokemonArray.forEach(async function iterateThrough(pokemon) {
    try{
    if(pokemon.length<12){
        throw `Pokemon id ${pokemon} is too short. Length must exceed 12 to be valid.`;
    }
    ObjectId(pokemon);
    user = await pokemons.findById(pokemon);
    if(user == null){
        console.log(`Cannot find Pokemon with id ${pokemon}`);
    }
    else{
        console.log(`Pokemon with id ${pokemon} has been found`);
        pokemonArray1.push(pokemon);
    }
}catch(error){
    console.log(error);
}
});
return pokemonArray1;
} catch(error){
    console.log(error);
}
}

async function getUser(req, res, next){
    try{
        user = await pokemonMap.findById(req.params.id);
        if(user == null){
            return res.status(404).json({message:'Cannot find User'});
        }
    } catch (err) {
        return res.status(500).json({message: err.message});
    }

    res.user = user;
    next();
}
module.exports = router;