const mongoose = require('mongoose')

const notesSchema = new mongoose.Schema({
    title: { type: String, required: true },
    summary: { type: String },
    content: { type: Object },
    // coverImage: { type: String, default: "https://loremflickr.com/900/400/tech" },
    author: { type: String, required: true },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: { type: Date, default: Date.now() },
    lastmodifiedAt: { type: Date, default: () => Date.now() },
    // viewCount: { type: Number, default: 0 },
    tags: [String],
    mentions: [String],
    // comments: [{
    //     comment: String,
    //     created: { type: Date, default: () => Date.now() },
    //     postedBy: String
    // }]

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

module.exports = mongoose.model('Notes', notesSchema)