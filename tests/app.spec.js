const request = require('supertest');
const app = require('../src/app');
const { connect, disconnect } = require('../src/helpers/db.helper');
const User = require('../src/schema/user.schema');
const Post = require('../src/schema/post.schema');
const { seed } = require('../src/helpers/seeder.helper');

beforeAll(async () => {
    await connect()
    await User.deleteMany({});
    await Post.deleteMany({});
});
afterAll(async () => await disconnect());

describe('POST /', () => {
    describe('#1. Test seeder', (done) => {
        test("DB should be empty at first", async () => {
            const [allUsersCount, allPostsCount] = await Promise.all([
                User.countDocuments({}),
                Post.countDocuments({})
            ]);
            expect(allUsersCount).toBe(0);
            expect(allPostsCount).toBe(0);
        });

        test("Seeder should create 100 users and 200 posts", async () => {
            await seed(log = false);
            const [allUsersCount, allPostsCount] = await Promise.all([
                User.countDocuments({}),
                Post.countDocuments({})
            ]);
            expect(allUsersCount).toBe(100);
            expect(allPostsCount).toBe(200);
        });
    });

    describe('#2. Test [POST] http://localhost:3000/posts', (done) => {
        test("Should create a valid post with valid date", async () => {
            const user = await User.findOne({});
            const data = {
                userId: user.id,
                title: "Test post title",
                description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            }
            await request(app)
                .post('/posts')
                .send(JSON.stringify(data))
                .set('Content-Type', 'application/json')
                .then(response => {
                    expect(response.statusCode).toBe(200);
                    expect(response.body?.data?._id).toBeDefined();
                    expect(response.body?.data?.userId).toBe(data.userId);
                    expect(response.body?.data?.title).toBe(data.title);
                    expect(response.body?.data?.description).toBe(data.description);
                });
        });
        test("Should fail with invalid userId", async () => {
            const data = {
                userId: 1,
                title: "Test post title",
                description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            }
            await request(app)
                .post('/posts')
                .send(JSON.stringify(data))
                .set('Content-Type', 'application/json')
                .then(response => {
                    expect(response.statusCode).toBe(422);
                    expect(response.body?.error).toBe("Invalid userId");
                });
        });
        test("Should fail with invalid title", async () => {
            const user = await User.findOne({});
            const data = {
                userId: user.id,
                title: "Test",
                description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            }
            await request(app)
                .post('/posts')
                .send(JSON.stringify(data))
                .set('Content-Type', 'application/json')
                .then(response => {
                    expect(response.statusCode).toBe(422);
                    expect(response.body?.error).toBe("Invalid title");
                });
        });
        test("Should fail with invalid description", async () => {
            const user = await User.findOne({});
            const data = {
                userId: user.id,
                title: "Test post title",
                description: "Lorem Ipsum",
            }
            await request(app)
                .post('/posts')
                .send(JSON.stringify(data))
                .set('Content-Type', 'application/json')
                .then(response => {
                    expect(response.statusCode).toBe(422);
                    expect(response.body?.error).toBe("Invalid description");
                });
        });
    })

    describe('#3. Test [GET] http://localhost:3000/users', (done) => {
        test("Should list all the users with their post count", async () => {
            await request(app)
                .get('/users')
                .then(response => {
                    expect(response.statusCode).toBe(200);
                    expect(response.body?.data?.users).toBeDefined();
                    // must be array
                    expect(Array.isArray(response.body?.data?.users)).toBe(true);
                    const { users, meta } = response.body?.data;
                    // must have post count
                    expect(users[0].postCount).toBeDefined();
                });
        });
        test("Should have pagination implemented", async () => {
            await request(app)
                .get('/users')
                .then(response => {
                    expect(response.statusCode).toBe(200);
                    expect(response.body?.data?.users).toBeDefined();
                    // must be array
                    expect(Array.isArray(response.body?.data?.users)).toBe(true);
                    const { meta } = response.body?.data;

                    // must have meta object
                    expect(meta).toBeDefined();
                    expect(meta.totalCount).toBeDefined()
                    expect(meta.totalCount).toBe(10)
                    expect(meta.currentPage).toBeDefined()
                    expect(meta.totalPages).toBeDefined()
                    expect(meta.limit).toBeDefined()
                    expect(meta.hasNextPage).toBeDefined()
                    expect(meta.hasPreviousPage).toBeDefined()
                });
        });
    });
})