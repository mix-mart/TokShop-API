// Define a Video model schema (using Mongoose, if desired)
const mongoose = require('mongoose');
const { Schema } = mongoose;

const froblogSchema = new Schema({
  blogName: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'Too short product title'],
    maxlength: [100, 'Too long product title'],
},
  description: {
    type: String,
    required: [true, 'Product description is required'],
    minlength: [20, 'Too short product description'],
  },
  images: {
    type: Array,
    required: [true, 'Product Images  is required'],
  },


  
},
{ timestamps: true, autoIndex: true, autoCreate: true });

const froblog = mongoose.model('froblog', froblogSchema);
module.exports = froblog;
