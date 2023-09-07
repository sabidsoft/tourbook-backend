const { Schema, model } = require("mongoose");

const tourSchema = new Schema({
    title: String,
    description: String,
    name: String,
    creator: String,
    tags: [String],
    imageFile: String,
    likeCount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true
})


const Tour = model("Tour", tourSchema);

module.exports = Tour;