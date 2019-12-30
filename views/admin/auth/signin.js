const layout = require('../layout');

module.exports = () => {
    return layout({
        content: `
        <div>
            <form action="" method="POST">
                <input type="text" name="email" placeholder="Email" />
                <input type="text" name="password" placeholder="Password" />
                <button>Sign In</button>
            </form>
        </div>
    `
    });
}
