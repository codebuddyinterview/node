const faker = require('faker');
const User = require('../schema/user.schema');
const Post = require('../schema/post.schema');

module.exports.seed = async () => {
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
}