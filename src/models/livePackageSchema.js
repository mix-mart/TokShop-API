const mongoose = require('mongoose');
const { Schema } = mongoose;

const packageSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  minutePrice:{
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    // required: true,
  },
  durationInMinutes: {
    type: Number,
    required: true,
    min: [1, 'Min duration value is 1.0'],
    
  },
  numberOfProducts: {
    type: Number,
    required: true,
  },
  description: String,
  isActive: {
    type: Boolean,
    default: false,
  },
  country:String,
}, { timestamps: true });

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;
