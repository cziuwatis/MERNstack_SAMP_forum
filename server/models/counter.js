
const mongoose = require('mongoose');

let countersSchema = new mongoose.Schema(
        {
            sequence_value: {type: Number}
        });

module.exports = mongoose.model('counters', countersSchema);