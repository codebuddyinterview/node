const { seed } = require('./src/helpers/seeder.helper');
const { connect } = require('./src/helpers/db.helper');

connect().then(async () => {
    seed();
    process.exit(0);
});

