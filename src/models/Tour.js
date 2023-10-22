const { Schema, model } = require("mongoose");

const tourSchema = new Schema({
    title: String,
    description: String,
    imageUrl: String,
    creatorId: String,
    creatorName: String,
    likedUsers: {          // likedUserIds
        type: [String],
        default: []
    },
    tags: [String],

}, {
    timestamps: true
})


const Tour = model("Tour", tourSchema);

module.exports = Tour;