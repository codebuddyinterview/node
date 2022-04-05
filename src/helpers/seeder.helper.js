const faker = require('faker');
const chalk = require('chalk');
const User = require('../schema/user.schema');
const Post = require('../schema/post.schema');

module.exports.seed = async (log = true) => {
    await User.deleteMany({});
    await Post.deleteMany({});
    if (log) {
        console.log(chalk.green('Connected to database...'));
        console.log(chalk.green('Seeder started...'));
    }

    await Promise.all(
        Array.from(Array(100).keys()).map(async () => {
            const resp = await User.create({
                name: faker.name.firstName()
            });
            if (log) console.log(chalk.blue("Created user's name: ", resp.name));

            await Promise.all(
                Array.from(Array(2).keys()).map(async () => {
                    await Post.create({
                        userId: resp._id,
                        title: faker.lorem.sentence(),
                        description: faker.lorem.paragraph(10)
                    });
                })
            );
        })
    );

    if (log) console.log(chalk.green('Seeder completed... Exiting...'));
}