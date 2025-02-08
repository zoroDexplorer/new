const mongoosese = require('mongoose');

const gallerySchema = new mongoosese.Schema({
    username: {
        type: String,
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    song:{
        type: String,
    }
});

module.exports = mongoosese.model('Gallery', gallerySchema);