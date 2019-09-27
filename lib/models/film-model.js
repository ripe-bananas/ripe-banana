const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = require('mongoose').Types;

const schema = new Schema({
  title: {
    type: String,
    required: true
  },
  studio: {
    type: ObjectId,
    ref: 'Studio',
    required: true
  },
  released: {
    type: Number,
    required: true
  },
  cast: [{
    role:{
      type: String
    },
    actor:{
      type: ObjectId,
      ref: 'Actor',
      required: true
    }
  }]
});

module.exports = mongoose.model('Film', schema);