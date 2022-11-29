const chalk = require('chalk');
const app = require('./src/app');
const dotenv = require('dotenv');
dotenv.config()
const { connect } = require('./src/helpers/db.helper');

connect().then(() => {
    const port = process.env.PORT
    app.listen(port, () => {
        console.log(chalk.green(`Server started on port http://localhost:${port}`));
    });
}).catch(err => {
    console.log(err);
    process.exit(1);
});