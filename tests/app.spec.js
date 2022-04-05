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
                    const { users } = response.body?.data;
                    // must have post count
                    expect(users[0].posts).toBeDefined();
                });
        });
        test("Should have pagination implemented", async () => {
            await request(app)
                .get('/users?page=1&limit=10')
                .then(response => {
                    expect(response.statusCode).toBe(200);
                    expect(response.body?.data?.users).toBeDefined();
                    // must be array
                    expect(Array.isArray(response.body?.data?.users)).toBe(true);
                    const { pagination } = response.body?.data;

                    // must have meta object
                    expect(pagination).toBeDefined();
                    expect(pagination.totalDocs).toBeDefined()
                    expect(pagination.totalDocs).toBe(100)
                    expect(pagination.page).toBeDefined()
                    expect(pagination.page).toBe(1)
                    expect(pagination.totalPages).toBeDefined()
                    expect(pagination.totalPages).toBe(10)
                    expect(pagination.limit).toBeDefined()
                    expect(pagination.limit).toBe(10)
                    expect(pagination.hasNextPage).toBeDefined()
                    expect(pagination.hasNextPage).toBe(true)
                    expect(pagination.hasPrevPage).toBeDefined()
                    expect(pagination.hasPrevPage).toBe(false)
                });

            await request(app)
                .get('/users?page=2&limit=10')
                .then(response => {
                    expect(response.statusCode).toBe(200);
                    expect(response.body?.data?.users).toBeDefined();
                    // must be array
                    expect(Array.isArray(response.body?.data?.users)).toBe(true);
                    const { pagination } = response.body?.data;

                    // must have meta object
                    expect(pagination).toBeDefined();
                    expect(pagination.totalDocs).toBeDefined()
                    expect(pagination.totalDocs).toBe(100)
                    expect(pagination.page).toBeDefined()
                    expect(pagination.page).toBe(2)
                    expect(pagination.totalPages).toBeDefined()
                    expect(pagination.totalPages).toBe(10)
                    expect(pagination.limit).toBeDefined()
                    expect(pagination.limit).toBe(10)
                    expect(pagination.hasNextPage).toBeDefined()
                    expect(pagination.hasNextPage).toBe(true)
                    expect(pagination.hasPrevPage).toBeDefined()
                    expect(pagination.hasPrevPage).toBe(true)
                });
        });
    });
})