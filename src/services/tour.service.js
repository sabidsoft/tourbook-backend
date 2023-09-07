const Tour = require("../models/Tour");

exports.createTourService = async (data) => {
    const tour = await Tour.create(data);
    return tour;
}

exports.getToursService = async () => {
    const tours = await Tour.find({});
    return tours;
}

exports.getTourService = async (id) => {
    const tours = await Tour.findOne({ _id: id });
    return tours;
}

exports.getToursByUserService = async (id) => {
    const tours = await Tour.find({ creator: id });
    return tours;
}

exports.deleteTourService = async (id) => {
    const result = await Tour.deleteOne({ _id: id });
    return result;
}

exports.updateTourService = async (id, data) => {
    const result = await Tour.updateOne({ _id: id }, { $set: data }, { runValidators: true });
    return result;
}