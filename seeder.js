const faker = require('faker');
const connection = require('./src/helpers/db.helper');
const User = require('./src/schema/user.schema');
const Post = require('./src/schema/post.schema');

connection.then(async () => {
    console.log('Connected to database...');
    console.log('Seeder started...');
    
    Promise.all(
        Array.from(Array(100).keys()).map(async () => {
            const resp = User.create({
                name: faker.name.firstName()
            });
            console.log("Created user's name: ", resp.name);

            Promise.all(
                Array.from(Array(2).keys()).map(async () => {
                    Post.create({
                        userId: resp._id,
                        title: faker.lorem.sentence(),
                        description: faker.lorem.paragraph(10)
                    });
                }
            ));
        }
    ));

    console.log('Seeder completed... Exiting...');
    process.exit(0);
});

