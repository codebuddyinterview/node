const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()

module.exports.connect = () => mongoose.connect('mongodb://127.0.0.1:27017/test'); //process.env.DB_URL mongodb://127.0.0.1:27017

module.exports.disconnect = () => mongoose.disconnect();