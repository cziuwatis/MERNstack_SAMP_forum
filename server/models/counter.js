
const mongoose = require('mongoose');

let countersSchema = new mongoose.Schema(
        {
            _id: {type: String, required: true},
            sequence_value: {type: Number, default: 1}
        });

module.exports = mongoose.model('counters', countersSchema);