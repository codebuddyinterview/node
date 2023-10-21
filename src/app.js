const express = require('express');
const { getUsersWithPostCount } = require('./controllers/user.controller');

const app = express();
console.log('hi there ...')
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/users', getUsersWithPostCount);

module.exports = app;