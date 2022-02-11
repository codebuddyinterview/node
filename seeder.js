const { seed } = require('./src/helpers/seeder.helper');
const { connect } = require('./src/helpers/db.helper');

connect().then(async () => {
    await seed();
    process.exit(0);
});

