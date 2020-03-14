const mongoose = require('mongoose');

let carSchema = new mongoose.Schema(
   {
        model: {type: String},
        colour: {type: String},
        year: {type: Number},
        price: {type: Number}
   })

module.exports = mongoose.model('car', carSchema)