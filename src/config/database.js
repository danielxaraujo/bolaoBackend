const mongoose = require('mongoose')
module.exports = mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1/bolaomesa5')