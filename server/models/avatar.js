const mongoose = require('mongoose');
let imageSchema = new mongoose.Schema(
        {
            imageName: {type: String, default: 'profile.png', required: true},
            imageData: {type: String, required: true}
        });

module.exports = mongoose.model('avatar', imageSchema);