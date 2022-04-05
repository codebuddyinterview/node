const request = require('supertest');
const app = require('../src/app');
const { connect, disconnect } = require('../src/helpers/db.helper');

beforeAll(async () => {
    await connect()
});
afterAll(async () => await disconnect());

describe('POST /', () => {
    describe('#1. Test [GET] http://localhost:3000/users', (done) => {
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