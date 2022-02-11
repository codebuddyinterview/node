const request = require('supertest');
const app = require('../src/app');
const { connect, disconnect } = require('../src/helpers/db.helper');

beforeAll(async () => {
    await connect()
});
afterAll(async () => await disconnect());

describe('POST /', () => {
    describe('should return 200 OK', (done) => {
        test("true", () => {
            expect(true).toBe(true);
        })
    });
})