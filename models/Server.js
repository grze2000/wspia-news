const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serverSchema = new Schema({
  serverID: String,
  channelID: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('Server', serverSchema, 'servers');