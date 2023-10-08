const Tour = require("../models/Tour");

exports.getToursService = async (filters, page, limit, sort, field) => {
    page = parseInt(page);
    limit = parseInt(limit);

    const tours = await Tour
        .find(filters)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .select(field);

    const totalDocuments = await Tour.countDocuments(filters);

    const pagination = {
        totalPage: Math.ceil(totalDocuments / limit),
        currentPage: page,
        previousPage: page - 1 === 0 ? null : page - 1,
        nextPage: page + 1 <= Math.ceil(totalDocuments / limit) ? page + 1 : null
    }

    if (pagination.currentPage > pagination.totalPage) {
        pagination.currentPage = null;
        pagination.previousPage = null;
        pagination.nextPage = null;
    }

    return { tours, pagination };
}

exports.getTourService = async (id) => {
    const tour = await Tour.findOne({ _id: id });
    return tour;
}

exports.getToursByTagNameService = async (tag) => {
    const tours = await Tour.find({ tags: { $in: tag } });
    return tours;
}

exports.createTourService = async (data) => {
    const tour = await Tour.create(data);
    return tour;
}

exports.deleteTourService = async (id) => {
    const result = await Tour.deleteOne({ _id: id });
    return result;
}

exports.updateTourService = async (id, data) => {
    const result = await Tour.updateOne({ _id: id }, { $set: data }, { runValidators: true });
    return result;
}