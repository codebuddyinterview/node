# Welcome to Round 3 of your NodeJS Interview
# ![Codebuddy Pvt. Ltd. Round 3 Interview](https://codebuddy.co/assets/img/logo.png)

> This round is to test your **Debugging capabilities, Code optimization skills and Code quality** in a real world application.

> This repo uses express js and mongooose to create a backend server and perform DB(MongoDB) operations.

> **_Please read the below instructions carefully_**

# Tasks
1. `npm run seeder` creates 100 users and 2 posts per user. Find out why this is not working, fix the seeder and seed data.


2. `[POST] http://localhost:3000/posts` with data 
``` json
{
    "userId": "{userId}",
    "title": "Post Title",
    "body": "Post Body"
}
``` 
should create a post and return the newly created post in the response.