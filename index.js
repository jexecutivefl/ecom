const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res)=> {
   res.send(`
    <div>
        <form action="" method="POST">
            <input type="email" name="email" placeholder="Email" />
            <input type="password" name="password" placeholder="Password" />
            <input type="password" name="passwordConfirmation" placeholder="Password Confirmation">
            <button>Sign Up</button>
        </form>
    </div>
   `);
});


app.post('/', (req, res)=>{
    console.log(req.body);
    res.send('account created');
});

app.listen(3000, () => {
    console.log('Listening');
});
