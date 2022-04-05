const chalk = require('chalk');
const app = require('./src/app');
const { connect } = require('./src/helpers/db.helper');

connect().then(() => {
    app.listen(3000, () => {
        console.log(chalk.green('Server started on port http://localhost:3000'));
    });
}).catch(err => {
    console.log(err);
    process.exit(1);
});