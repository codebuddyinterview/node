const express = require('express');
const { createPost } = require('./controllers/post.controller');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/posts', createPost);

module.exports = app;