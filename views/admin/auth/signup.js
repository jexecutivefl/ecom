const layout = require('../layout');
const getError = (errors, prop) => {
    // prop === email password or passwordConfirmation
    try {
        return errors.mapped()[prop].msg;
    } catch (err) {
     return '';
    }
};
module.exports = ({req, errors}) => {
    return layout({
       content: `
        <div>
            'Your id is: ' + ${req.session.userId}
            <form action="" method="POST">
                <input type="text" name="email" placeholder="Email" />
                ${getError(errors, 'email')}
                <input type="text" name="password" placeholder="Password" />
                ${getError(errors, 'password')}
                <input type="text" name="passwordConfirmation" placeholder="Password Confirmation">
                ${getError(errors, 'passwordConfirmation')}
                <button>Sign Up</button>
            </form>
        </div>
    `
    });
};
