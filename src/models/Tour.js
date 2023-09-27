const { Schema, model } = require("mongoose");

const tourSchema = new Schema({
    title: String,
    description: String,
    imageUrl: String,
    tags: [String],
    creator: String,
    likeCount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true
})


const Tour = model("Tour", tourSchema);

module.exports = Tour;