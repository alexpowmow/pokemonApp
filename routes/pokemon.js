const express = require('express');
const router = express.Router();
const Pokemon = require('../models/pokemons.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');


/**
 * @swagger
 * paths:
 *  /pokemon:
 *   get:
 *     summary: Returns all of the pokemon in the database
 *     tags: [Pokemons]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/Pokemon'
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
 *  /pokemon/{id}:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Returns a pokemon with given id
 *     tags: [Pokemons]
 *     parameters:
 *      - in: path
 *        name: id
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/Pokemon'
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

/**
 * @swagger
 * paths:
 *  /pokemon:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Post a new pokemon
 *     tags: [Pokemons]
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *          $ref: '#components/schemas/Pokemon'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/Pokemon'
 *       201:
 *         $ref: '#/components/responses/CreatedResource'
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

/**
 * @swagger
 * paths:
 *  /pokemon/{id}:
 *   patch:
 *     security:
 *      - bearerAuth: []
 *     summary: Edit a pokemons attributes
 *     tags: [Pokemons]
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *          $ref: '#components/schemas/Pokemon'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/Pokemon'
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

/**
 * @swagger
 * paths:
 *  /pokemon/{id}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     summary: Deletes a pokemon with given id
 *     tags: [Pokemons]
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
router.get('/', async (req, res) => {
try{
    const pokemons = await Pokemon.find();
    res.send(pokemons);
} catch (err) {
 res.status(500).json(standardError(500, 'Internal server error'));
}
});

router.get('/:id', authenticateToken, getPokemon, (req, res) => {
    res.status(200).json(successResponse(200, 'Pokemon found',res.pokemon));
});

router.post('/', authenticateToken, async (req, res) => {
    
    try{
        const pokemon = new Pokemon({
            name: req.body.name,
            element: req.body.element,
            attack: req.body.attack,
            health: req.body.health,
            weakness: req.body.weakness
        });
        const newPokemon = await pokemon.save();
        res.status(201).json(successResponse(201, 'Pokemon created', newPokemon));
    } catch(err){
        res.status(400).json(standardError(400, 'Could not create pokemon'));
    }
});

router.patch('/:id', authenticateToken, async(req, res) => {
    
    var pokemon = null;
    try{
        pokemon = await Pokemon.findById(req.params.id);
        if(pokemon == null){
            return res.status(404).json(standardError(404, 'Could not find pokemon'));
        }
    } catch (err) {
        return res.status(500).json(standardError(500, 'Internal server error'));
    }
    
    if(req.body.name != null){
        pokemon.name = req.body.name;
    }
    if(req.body.element != null){
        pokemon.element = req.body.element;
    }
    if(req.body.attack != null){
        pokemon.attack = req.body.attack;
    }
    if(req.body.health != null){
        pokemon.health= req.body.health;
    }
    if(req.body.weakness != null){
        pokemon.weakness = req.body.weakness;
    }

    try{
        const updatedPokemon = await pokemon.save();
        res.status(200).json(successResponse(200, 'Patched pokemon', updatedPokemon));
    } catch(err){
        res.status(400).json(standardError(400, 'Could not patch pokemon'))
    }
});


router.delete('/:id', authenticateToken, async (req, res) => {
    try{
        const pokemon = await Pokemon.findById(req.params.id);
        if(pokemon == null){
            return res.status(404).json(standardError(404, 'Could not find pokemon'));
        }
        await pokemon.remove();
        res.status(200).json(standardSuccess(200, `Pokemon with id ${pokemon.id} has been removed`));
    } catch(err){
        res.status(500).json(standardError(500, 'Internal server error'));
    }
});

async function getPokemon(req, res, next){
    try{
        pokemon = await Pokemon.findById(req.params.id);
        if(pokemon == null){
            return res.status(404).json(standardError(404, "Could not find pokemon"));
        }
    } catch (err) {
        return res.status(500).json(standardError(500, 'Internal server error'));
    }

    res.pokemon = pokemon;
    next();
}

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

function standardError(status, message){
    const errorId = uuidv4();
    const error = {Error: {id: uuidv4(), message: message, code: status}};
    return error;
    
    };
    
    function standardSuccess(status, message){
    const successId = uuidv4();
    const success = {Success: {id: uuidv4(), message: message, code: status}};
    return success;
    };
    
    function successResponse(status, message, content){
    const successId = uuidv4();
    const success = {Success: {id: uuidv4(), message: message, code: status} , Content: content};
    return success;
    };

module.exports = router;