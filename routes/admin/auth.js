const express = require('express');
//Validator docs found at https://express-validator.github.io/docs/ and under validation chain
//to get validation classes
const {check,validationResult} = require('express-validator');

const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const {requireEmail, requirePassword, requirePasswordConfirmation} = require('./validators');
//create sub router
const router = express.Router();
router.get('/signup', (req, res)=> {
    res.send(signupTemplate({req}));
});

router.get('/signin', (req, res)=> {
   res.send(signinTemplate());
});

router.post('/signup', [
    requireEmail,
    requirePassword,
    requirePasswordConfirmation
], async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.send(signupTemplate({req, errors}));
    }
    //deconstruct email
    const {email, password, passwordConfirmation} = req.body;

    //create account user and pers
    const user = await usersRepo.create({email, password});
    //store the id of that user inside the users cookie
    req.session.userId = user.id;
    //
    res.send('account created');
});

router.get('/signout', (req,res) =>{
    req.session = null;
    res.send('You are logged out');
});

router.get('/signin', (req,res) => {
    res.send(`

    `);
});

router.post('/signin', async(req, res) => {
    const{email,password} = req.body;
    const user = await usersRepo.getOneBy({email});
    if(!user){
        return  res.send('Email not found');
    }

    const validPassword = await usersRepo.comparePasswords(
        user.password,
        password
    );
    if(!validPassword){
        return res.send('Invalid password');
    }

    req.session.userId = user.id;

    res.send('You are signed in!');
});

module.exports = router;
