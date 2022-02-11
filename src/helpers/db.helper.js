const mongoose = require('mongoose');

module.exports.connect = () => mongoose.connect('mongodb://localhost:27017/codebuddy-interview-node');
module.exports.disconnect = () => mongoose.disconnect();