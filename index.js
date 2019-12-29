const express = require('express');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');


const usersRepo = require('./repositories/users');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
    keys: ['a98dfa6df09sdaf098sadf']
}));

app.get('/', (req, res)=> {
   res.send(`
    <div>
    'Your id is: ' + ${req.session.userId}
        <form action="" method="POST">
            <input type="email" name="email" placeholder="Email" />
            <input type="password" name="password" placeholder="Password" />
            <input type="password" name="passwordConfirmation" placeholder="Password Confirmation">
            <button>Sign Up</button>
        </form>
    </div>
   `);
});

app.post('/', async (req, res)=>{
    //deconstruct email
    const {email, password, passwordConfirmation} = req.body;
    //is email already in system
    const existingUser = await usersRepo.getOneBy({email});
    if (existingUser) {
        return res.send('Email in use');
    }
    //Does the password and password confirmation match
    if (password !== passwordConfirmation) {
        return res.send('passwords must match');
    }
    //create account user and pers
    const user = await usersRepo.create({email, password});
    //store the id of that user inside the users cookie
    req.session.userId = user.id;
    //
    res.send('account created');
});

app.listen(3000, () => {
    console.log('Listening');
});
