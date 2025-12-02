const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VocabSchema = new Schema(
    {
        english: { 
            type: String, 
            required: [true, 'English word cannot be blank'],
            trim: true,
        },
        german: {
            type: String,
            required: [true, 'German word cannot be blank'],
            trim: true,
        },
        japanese: {
            type: String,
            required: [true, 'Japanese word cannot be blank'],
            trim: true,
        },
        deck: {
            type: String,
            default: '',
            trim: true,
        },
        tags: {
            type: [String],
            default: [],
            trim: true,
        },
    },
    { collection: 'vocab' }
);

module.exports = mongoose.model('Vocab', VocabSchema);