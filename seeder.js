const connection = require('./src/helpers/db.helper');
const user = require('./src/schema/user.schema');
const faker = require('faker');

connection.then(async () => {
    console.log('Connected to database...');
    console.log('Seeder started...');
    
    Promise.all(
        Array.from(Array(100).keys()).map(async () => {
            const resp = user.create({
                name: faker.name.firstName()
            });
            console.log("Created user's name: ", resp.name);
        }
    ));

    console.log('Seeder completed... Exiting...');
    process.exit(0);
});

