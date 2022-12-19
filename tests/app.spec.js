const request = require("supertest");
const { existsSync } = require("fs");
const app = require("../src/app");
const { connect, disconnect } = require("../src/helpers/db.helper");

beforeAll(async () => {
  await connect();
});
afterAll(async () => await disconnect());

describe("#1. Check .env.sample file exists", () => {
  test("Should check for .env.sample file", async () => {
    const doExists = existsSync("./.env.example");

    expect(doExists).toBe(true);
  });
});

describe("#2. Test [GET] users", () => {
  test("Should check for default page and limit", async () => {
    await request(app)
      .get("/users")
      .then((response) => {
        expect(response.statusCode).toBe(200);

        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();

        expect(response.body.data).toHaveProperty("users");
        expect(response.body.data).toHaveProperty("pagination");
        expect(Object.keys(response.body.data).length).toBe(2);

        const { pagination, users } = response.body.data;

        expect(Array.isArray(users)).toBeTruthy();
        expect(users.length).toBe(10);

        // must have meta object
        expect(pagination).toHaveProperty("totalDocs");
        expect(pagination).toHaveProperty("limit");
        expect(pagination).toHaveProperty("page");
        expect(pagination).toHaveProperty("totalPages");
        expect(pagination).toHaveProperty("pagingCounter");
        expect(pagination).toHaveProperty("hasPrevPage");
        expect(pagination).toHaveProperty("hasNextPage");
        expect(pagination).toHaveProperty("prevPage");
        expect(pagination).toHaveProperty("nextPage");
        expect(Object.keys(pagination).length).toBe(9);
        expect(pagination.totalDocs).toBe(100);
        expect(pagination.page).toBe(1);
        expect(pagination.pagingCounter).toBe(1);
        expect(pagination.totalPages).toBe(10);
        expect(pagination.limit).toBe(10);
        expect(pagination.hasNextPage).toBeTruthy();
        expect(pagination.hasPrevPage).toBeFalsy();
        expect(pagination.prevPage).toBeNull();
        expect(pagination.nextPage).toBe(2);
      });
  });

  test("Should check for /users?page=3&limit=33", async () => {
    const PAGE = 3,
      LIMIT = 33;

    await request(app)
      .get(`/users?page=${PAGE}&limit=${LIMIT}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);

        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();

        expect(response.body.data).toHaveProperty("users");
        expect(response.body.data).toHaveProperty("pagination");
        expect(Object.keys(response.body.data).length).toBe(2);

        const { pagination, users } = response.body.data;

        expect(Array.isArray(users)).toBeTruthy();

        expect(users.length).toBe(33);

        // must have meta object
        expect(pagination).toHaveProperty("totalDocs");
        expect(pagination).toHaveProperty("limit");
        expect(pagination).toHaveProperty("page");
        expect(pagination).toHaveProperty("totalPages");
        expect(pagination).toHaveProperty("pagingCounter");
        expect(pagination).toHaveProperty("hasPrevPage");
        expect(pagination).toHaveProperty("hasNextPage");
        expect(pagination).toHaveProperty("prevPage");
        expect(pagination).toHaveProperty("nextPage");
        expect(Object.keys(pagination).length).toBe(9);
        expect(pagination.totalDocs).toBe(100);
        expect(pagination.page).toBe(PAGE);
        expect(pagination.pagingCounter).toBe(67);
        expect(pagination.totalPages).toBe(4);
        expect(pagination.limit).toBe(LIMIT);
        expect(pagination.hasNextPage).toBeTruthy();
        expect(pagination.hasPrevPage).toBeTruthy();
        expect(pagination.prevPage).toBe(2);
        expect(pagination.nextPage).toBe(4);
      });
  });

  test("Should check for /users?page=4&limit=33", async () => {
    const PAGE = 4,
      LIMIT = 33;

    await request(app)
      .get(`/users?page=${PAGE}&limit=${LIMIT}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);

        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();

        expect(response.body.data).toHaveProperty("users");
        expect(response.body.data).toHaveProperty("pagination");
        expect(Object.keys(response.body.data).length).toBe(2);

        const { pagination, users } = response.body.data;

        expect(Array.isArray(users)).toBeTruthy();
        expect(users.length).toBe(1);

        const user = users[0];
        expect(user).toHaveProperty("_id");
        expect(user).toHaveProperty("name");
        expect(user).toHaveProperty("posts");
        expect(Object.keys(user).length).toBe(3);

        // must have meta object
        expect(pagination).toHaveProperty("totalDocs");
        expect(pagination).toHaveProperty("limit");
        expect(pagination).toHaveProperty("page");
        expect(pagination).toHaveProperty("totalPages");
        expect(pagination).toHaveProperty("pagingCounter");
        expect(pagination).toHaveProperty("hasPrevPage");
        expect(pagination).toHaveProperty("hasNextPage");
        expect(pagination).toHaveProperty("prevPage");
        expect(pagination).toHaveProperty("nextPage");
        expect(Object.keys(pagination).length).toBe(9);
        expect(pagination.totalDocs).toBe(100);
        expect(pagination.page).toBe(PAGE);
        expect(pagination.pagingCounter).toBe(100);
        expect(pagination.totalPages).toBe(4);
        expect(pagination.limit).toBe(LIMIT);
        expect(pagination.hasNextPage).toBeFalsy();
        expect(pagination.hasPrevPage).toBeTruthy();
        expect(pagination.prevPage).toBe(3);
        expect(pagination.nextPage).toBeNull();
      });
  });

  test("Should check for /users?page=6&limit=20", async () => {
    const PAGE = 6,
      LIMIT = 20;

    await request(app)
      .get(`/users?page=${PAGE}&limit=${LIMIT}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);

        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();

        expect(response.body.data).toHaveProperty("users");
        expect(response.body.data).toHaveProperty("pagination");
        expect(Object.keys(response.body.data).length).toBe(2);

        const { pagination, users } = response.body.data;

        expect(Array.isArray(users)).toBeTruthy();
        expect(users.length).toBe(0);

        // must have meta object
        expect(pagination).toHaveProperty("totalDocs");
        expect(pagination).toHaveProperty("limit");
        expect(pagination).toHaveProperty("page");
        expect(pagination).toHaveProperty("totalPages");
        expect(pagination).toHaveProperty("pagingCounter");
        expect(pagination).toHaveProperty("hasPrevPage");
        expect(pagination).toHaveProperty("hasNextPage");
        expect(pagination).toHaveProperty("prevPage");
        expect(pagination).toHaveProperty("nextPage");
        expect(Object.keys(pagination).length).toBe(9);
        expect(pagination.totalDocs).toBe(100);
        expect(pagination.page).toBe(PAGE);
        expect(pagination.pagingCounter).toBe(101);
        expect(pagination.totalPages).toBe(5);
        expect(pagination.limit).toBe(LIMIT);
        expect(pagination.hasNextPage).toBeFalsy();
        expect(pagination.hasPrevPage).toBeTruthy();
        expect(pagination.prevPage).toBe(5);
        expect(pagination.nextPage).toBeNull();
      });
  });

  test("Should check for /users?page=7&limit=30", async () => {
    const PAGE = 7,
      LIMIT = 30;

    await request(app)
      .get(`/users?page=${PAGE}&limit=${LIMIT}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);

        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();

        expect(response.body.data).toHaveProperty("users");
        expect(response.body.data).toHaveProperty("pagination");
        expect(Object.keys(response.body.data).length).toBe(2);

        const { pagination, users } = response.body.data;

        expect(Array.isArray(users)).toBeTruthy();
        expect(users.length).toBe(0);

        // must have meta object
        expect(pagination).toHaveProperty("totalDocs");
        expect(pagination).toHaveProperty("limit");
        expect(pagination).toHaveProperty("page");
        expect(pagination).toHaveProperty("totalPages");
        expect(pagination).toHaveProperty("pagingCounter");
        expect(pagination).toHaveProperty("hasPrevPage");
        expect(pagination).toHaveProperty("hasNextPage");
        expect(pagination).toHaveProperty("prevPage");
        expect(pagination).toHaveProperty("nextPage");
        expect(pagination.totalDocs).toBe(100);
        expect(pagination.page).toBe(PAGE);
        expect(pagination.pagingCounter).toBe(181);
        expect(pagination.totalPages).toBe(4);
        expect(pagination.limit).toBe(LIMIT);
        expect(pagination.hasNextPage).toBeFalsy();
        expect(pagination.hasPrevPage).toBeTruthy();
        expect(pagination.prevPage).toBe(6);
        expect(pagination.nextPage).toBeNull();
      });
  });
});
