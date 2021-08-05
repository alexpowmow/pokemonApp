const express = require('express');
const router = express.Router();
const User = require('../models/users.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pokemonMap = require('../models/pokemonMap.js');
const crypto = require('crypto-js');
const { db } = require('../models/users.js');

/**
 * @swagger
 * components:
 *  securitySchemes:
 *   bearerAuth:
 *    type: http
 *    scheme: bearer
 *    bearerFormat: JWT
 *  schemas:
 *   User:
 *    type: object
 *    required:
 *      - username
 *      - password
 *    properties:
 *      id:
 *       type: string
 *       description: Unique identifier for the user
 *      username:
 *       type: string
 *       description: User username
 *      password:
 *       type: string
 *       description: User password
 *      version:
 *       type: string
 *       description: Software version
 *    example:
 *       username: Alexpowmow
 *       password: Powder
 *   Pokemon:
 *    type: object
 *    required:
 *      - name
 *      - element
 *      - attack
 *      - health
 *      - weakness
 *    properties:
 *      id:
 *       type: String
 *       description: Unique identifier for a pokemon
 *      name:
 *       type: String
 *       description: Pokemon name
 *      element:
 *       type: String
 *       description: Pokemon element
 *      attack:
 *       type: String
 *       description: Pokemon attack
 *      health:
 *       type: String
 *       description: Pokemon health
 *      weakness:
 *       type: String
 *       description: Pokemon weakness
 *      version:
 *       type: String
 *       description: software version
 *    example:
 *     name: Charmander
 *     element: Fire
 *     attack: Flare
 *     health: 70
 *     weakness: Water
 *   Map:
 *    type: object
 *    required:
 *      - userId
 *      - pokemonIds
 *    properties:
 *      id:
 *       type: string
 *       description: Unique identifier for the map object
 *      userId:
 *       type: string
 *       description: Map userId
 *      pokemonIds:
 *       type: array
 *       description: PokemonIds attached to the user
 *      version:
 *       type: string
 *       description: Software version
 *    example:
 *       userId: kj4h5j4jb5j4h2j6k
 *       pokemonIds: [kjkmfkk345ofm4lm5, o3495934iojrj34l5j, 34990534lkjkj3kj]
 *  responses:
 *     UnauthorizedError:
 *      description: Access token is missing or invalid
 *     ForbiddenError:
 *      description: You do not have access to this route
 *     InternalServerError:
 *      description: Internal server error
 *     CreatedResource:
 *      description: Resource created successfully
 *     Success:
 *      description: Success
 * 
 */

/** 
@swagger
* security:
*  - bearerAuth: []
*/

/** 
@swagger
* tags:
*  name: Users
*  description: Used to manage user accounts
*/

/** 
@swagger
* tags:
*  name: Pokemons
*  description: Used to manage all Pokemons
*/

/** 
@swagger
* tags:
*  name: Map
*  description: Used map a user to their pokemons
*/


/**
 * @swagger
 * paths:
 *  /user:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Returns all of the users in the database
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
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
 *  /user/{id}:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Returns a user with a given ID
 *     tags: [Users]
 *     parameters:
 *      - in: path
 *        name: id
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
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
 *  /user:
 *   post:
 *     summary: Post a new user
 *     tags: [Users]
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *          $ref: '#components/schemas/User'
 *           
 *     responses:
 *       201:
 *         $ref: '#/components/responses/CreatedResource'
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
 *  /user/login:
 *   post:
 *     summary: Request for a user to login. If successful access token granted.
 *     tags: [Users]
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *          $ref: '#components/schemas/User'
 *           
 *     responses:
 *       201:
 *         $ref: '#/components/responses/CreatedResource'
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
 *  /user/{id}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     summary: Deletes a user with given id
 *     tags: [Users]
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


/**
 * @swagger
 * paths:
 *  /user/change-password:
 *   post:
 *     summary: Change a users password
 *     security:
 *      - bearerAuth: []
 *     tags: [Users]
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *            type: String
 *            description: The new password
 *            example:
 *                newpassword: "password1234"
 *           
 *     responses:
 *       201:
 *         $ref: '#/components/responses/CreatedResource'
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

const hashPassword = (password, salt, secret) => {
    const stringToSign = `${password}-${salt}`;
    const hash = crypto.HmacSHA256(stringToSign, secret)
    return crypto.enc.Base64.stringify(hash);
}


router.get('/', authenticateToken, async (req, res) => {
    try{
        const users = await User.find();
        res.status(200).send(users);
    } catch (err) {
     res.status(500).json({message: err.message});
    }
    });

router.get('/:id', authenticateToken, async (req, res) => {
    try{
        const userId = req.params.id;
        user = await User.findById(userId);
        if(user == null){
            return res.status(404).json({message:'Cannot find User'});
        }
        res.status(200).send(user);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
    });
    

    router.post('/', async (req, res) => {

        //const authHeader = req.headers['Basic Auth'];
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });

        
        const userCheck = await User.findOne({username:user.username}).lean();
        if(userCheck){
            return res.json({ status: 'error', error:'Username already exists'});
        }
        if(!user.username || typeof user.username !== 'string'){
            return res.json({ status: 'error', error:'Invalid username'});
        };

        if(!user.password || typeof user.password !== 'string'){
            return res.json({ status: 'error', error:'Invalid password'});
        };

        if(user.password.length <5){
            return res.json({ status: 'error', error:'Invalid password. Length must be greater than 5'});
        }

        //user.password = await bcrypt.hash(user.password, 10);
        console.log('Username ' + user.username);
        console.log('Password ' + user.password);
    

        
        try{
            const newUser = await user.save();
            const pokemonUser = new pokemonMap({
            userId: newUser.id,
            pokemonId: []
            });
            const newPokemonUser = await pokemonUser.save();
            res.status(201).json(newUser);
        } catch(err){
            res.status(400).json({ message: err.message});
        }
    });



router.post('/change-password', authenticateToken, async (req,res) => {
const newpassword = req.body.newpassword;


if(!newpassword || typeof newpassword !== 'string'){
    return res.json({ status: 'error', error:'Invalid password'});
};

if(newpassword.length <5){
    return res.json({ status: 'error', error:'Invalid password. Length must be greater than 5'});
}
try{
const user = req.user;
console.log(user);
const _id = user.id;
//const hashedPassword = hashPassword(newpassword, process.env.SALT, process.env.JWT_SECRET);
await User.updateOne({_id}, {$set:{password: newpassword}});
res.json({status: "ok"});
}catch(error){
    console.log(error);
    res.json({status:'error', error:'not verified'});
}

});


router.delete('/:id', authenticateToken, async (req, res) => {
    try{
        const userId = req.params.id;
        const user = await User.findById(userId);
        const userMap = await pokemonMap.findOne({userId:user.id}).lean();
        if(user == null){
            return res.status(404).json({message:'Cannot find User'});
        }
        if(userMap == null){
            return res.status(404).json({message:'Cannot find UserMap'});
        }
        console.log(user);
        console.log(userMap);
        await pokemonMap.findOne({userId:user.id}).lean().remove();
        
        await user.remove();
        
        res.status(200).json({status: `User with id ${user} has been removed alongside its map`});
    } catch(err){
        res.status(500).json({message: err.message});
    }
});

router.post('/login', async (req, res) => {
    const{username, password} = req.body;
    const user = await User.findOne({username}).lean();
    //res.send(user);
    //password = hashPassword(password, process.env.SALT, process.env.JWT_SECRET);
    console.log(`Username passed through body ${username}`);
    console.log(`Password passed through body ${password}`);
    console.log(`Password found in database ${user.password}`);

    if(!user){
        return res.json({status:'error', error: 'Invalid username/password'});
    };

  //const validUser = await bcrypt.compare(password, user.password);
    if(password === user.password){
        const token = jwt.sign({id: user._id, username: user.username}, process.env.JWT_SECRET,{expiresIn: '1h'});
        //console.log('here');
        res.json({accessToken: token});
        return res.status(200);
    };
    if(password !== user.password){
        res.json({status: "Error", error: "Incorrect Password"});
    }
    
    });

router.post('/pokemon', async (req, res) => {
    const user = jwt.verify(playToken, JWT_SECRET);

});





// async function getUser(userId){
//     try{
//         user = await User.findById(userId);
//         if(user == null){
//             return res.status(404).json({message:'Cannot find User'});
//         }
//     } catch (err) {
//         return co;
//     }
//     next();
// }

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


module.exports = router;