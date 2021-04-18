const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
  hash: String
});

module.exports = mongoose.model('News', newsSchema, 'news');