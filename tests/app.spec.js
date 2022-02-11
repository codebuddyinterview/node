const { connect, disconnect } = require('../src/helpers/db.helper');
const User = require('../src/schema/user.schema');
const Post = require('../src/schema/post.schema');

beforeAll(async () => {
    await connect()
    await User.deleteMany({});
    await Post.deleteMany({});
});
afterAll(async () => await disconnect());

describe('POST /', () => {
    describe('Test seeder', (done) => {
        test("DB should be empty at first", async () => {
            const [allUsersCount, allPostsCount] = await Promise.all([
                User.countDocuments({}),
                Post.countDocuments({})
            ]);
            expect(allUsersCount).toBe(0);
            expect(allPostsCount).toBe(0);
        });
    });
})