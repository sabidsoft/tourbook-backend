const createError = require("http-errors");
const { getUserByEmail } = require("../services/user.service");
const { successResponse } = require("../utils/response");
const cloudinary = require("../utils/cloudinary");
const {
    createTourService,
    getToursService,
    getTourService,
    deleteTourService,
    updateTourService,
} = require("../services/tour.service");

exports.getTours = async (req, res, next) => {
    try {
        let {
            search = '',
            page = 1,
            limit = 20,
            sort = '-createdAt',
            field = '',
            tagsValues = '',
            currentTourId = '',
            ...filterObject
        } = req.query;

        filterObject = JSON.stringify(filterObject);
        filterObject = filterObject.replace(/(gt|gte|lt|lte)/g, (value) => "$" + value);
        filterObject = JSON.parse(filterObject);

        let filters = {
            ...filterObject
        };

        // get tours by search value
        if (search) {
            const searchRegex = new RegExp(".*" + search + ".*", "i");

            filters = {
                ...filterObject,
                $or: [{ title: { $regex: searchRegex } }]
            }
        }

        // get tours by tags without current tour
        if (tagsValues && currentTourId) {
            const tagsArray = tagsValues.split(',');

            filters = {
                ...filterObject,
                tags: { $in: tagsArray },
                _id: { $ne: currentTourId }
            }
        }

        if (sort) sort = sort.split(',').join(' ');
        if (field) field = field.split(',').join(' ');

        const { tours, pagination } = await getToursService(filters, page, limit, sort, field);

        successResponse(res, {
            status: 200,
            message: "All tours returned",
            payload: { pagination, tours }
        })
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

exports.getTour = async (req, res, next) => {
    try {
        const tour = await getTourService(req.params.tourId);

        successResponse(res, {
            status: 200,
            message: "Tour returned by id",
            payload: { tour }
        })
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

exports.createTour = async (req, res, next) => {
    try {
        const { title, description, tags } = req.body;
        const { path } = req.file;

        const result = await cloudinary.uploader.upload(path, {
            folder: "tourbook/tour_images"
        });

        const user = await getUserByEmail(req.user?.email);

        const data = {
            title,
            description,
            creatorId: user._id,
            creatorName: user.name,
            tags: JSON.parse(tags),
            imageUrl: result.secure_url,
        };

        const tour = await createTourService(data);

        successResponse(res, {
            status: 200,
            message: "New tour created successfully",
            payload: { tour }
        })
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

exports.deleteTour = async (req, res, next) => {
    try {
        const tour = await getTourService(req.params.tourId);

        if (!tour)
            throw createError(404, "tour is not exist");

        const result = await deleteTourService(req.params.tourId);

        if (result.deletedCount === 0)
            throw createError(400, "failed to delete the tour");

        successResponse(res, {
            status: 200,
            message: "Tour deleted successfully",
            payload: { result }
        })
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

exports.updateTour = async (req, res, next) => {
    try {
        const { title, description, tags } = req.body;
        let cloudinaryImageResult;
        let data;

        if (req.file) {
            const { path } = req.file;
            cloudinaryImageResult = await cloudinary.uploader.upload(path, {
                folder: "tourbook/tour_images"
            });
        }

        if (cloudinaryImageResult) {
            data = {
                title,
                description,
                tags: JSON.parse(tags),
                imageUrl: cloudinaryImageResult.secure_url,
            }
        } else {
            data = {
                title,
                description,
                tags: JSON.parse(tags),


                imageUrl: req.body.image
            }
        }

        const result = await updateTourService(req.params.tourId, data);

        if (result.matchedCount === 0)
            throw createError(400, "failed to update the tour");

        successResponse(res, {
            status: 200,
            message: "Tour updated successfully",
            payload: { result }
        })
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

exports.likeTour = async (req, res, next) => {
    try {
        const tour = await getTourService(req.params.tourId);
        const user = await getUserByEmail(req.user?.email);

        const indexOfLikedUser = tour.likedUsers.findIndex(likedUser => likedUser === String(user._id));

        if (indexOfLikedUser === -1)
            tour.likedUsers.push(String(user._id));

        if (indexOfLikedUser !== -1)
            tour.likedUsers = tour.likedUsers.filter(likedUser => likedUser !== String(user._id));

        const result = await updateTourService(req.params.tourId, tour);

        if (result.matchedCount === 0)
            throw createError(400, "failed to update the tour");

        successResponse(res, {
            status: 200,
            message: "Tour updated successfully",
            payload: { result }
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}