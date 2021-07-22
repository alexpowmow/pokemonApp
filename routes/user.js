const express = require('express');
const router = express.Router();
const User = require('../models/users.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pokemonMap = require('../models/pokemonMap.js');



router.get('/', async (req, res) => {
    try{
        const users = await User.find();
        res.send(users);
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

        


        if(!user.username || typeof user.username !== 'string'){
            return res.json({ status: 'error', error:'Invalid username'});
        };

        if(!user.password || typeof user.password !== 'string'){
            return res.json({ status: 'error', error:'Invalid password'});
        };

        if(user.password.length <5){
            return res.json({ status: 'error', error:'Invalid password. Length must be greater than 5'});
        }

        user.password = await bcrypt.hash(user.password, 10);
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



router.post('/change-password', async (req,res) => {
const{token, newpassword} = req.body;


if(!newpassword || typeof newpassword !== 'string'){
    return res.json({ status: 'error', error:'Invalid password'});
};

if(newpassword.length <5){
    return res.json({ status: 'error', error:'Invalid password. Length must be greater than 5'});
}
try{
const user = jwt.verify(token, JWT_SECRET);
console.log(user);
const _id = user.id;
const hashedPassword = await bcrypt.hash(newpassword,10);
await User.updateOne({_id}, {$set:{password: hashedPassword}});
res.json({status: "ok"});
}catch(error){
    console.log(error);
    res.json({status:'error', error:'not verified'});
}




});

router.delete('/:id', getUser, async (req, res) => {
    try{
        const user = res.user.id;
        await res.user.remove();
        res.json({status: `User with id ${user} has been removed`});
    } catch(err){
        res.status(500).json({message: err.message});
    }
});

router.post('/login', async (req, res) => {
    const{username, password} = req.body;
    const user = await User.findOne({username}).lean();
    //res.send(user);
    console.log(username);
    console.log(password);
    console.log(user.password);

    if(!user){
        return res.json({status:'error', error: 'Invalid username/password'});
    };

  const validUser = await bcrypt.compare(password, user.password);
    if(validUser){
        const token = jwt.sign({id: user._id, username: user.username}, process.env.JWT_SECRET,{expiresIn: '1h'});
        //console.log('here');
        res.json({accessToken: token});
        return res.status(200);
    };
    if(!validUser){
        res.json({status: "Error", error: "Incorrect Password"});
    }
    
    });

router.post('/pokemon', async (req, res) => {
    const user = jwt.verify(playToken, JWT_SECRET);

});





async function getUser(req, res, next){
    try{
        user = await User.findById(req.params.id);
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