const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()

module.exports.connect = () => mongoose.connect(process.env.DB_URL);
module.exports.disconnect = () => mongoose.disconnect();