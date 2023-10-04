const createError = require("http-errors");
const { getUserByEmail } = require("../services/user.service");
const { successResponse } = require("../utils/response");
const cloudinary = require("../utils/cloudinary");
const {
    createTourService,
    getToursService,
    getTourService,
    getToursByUserService,
    deleteTourService,
    updateTourService
} = require("../services/tour.service");

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
            message: "new tour created successfully",
            payload: { tour }
        })
    }
    catch (err) {
        next(err);
    }
}

exports.getTours = async (req, res, next) => {
    try {
        const tours = await getToursService();

        successResponse(res, {
            status: 200,
            message: "all tours returned",
            payload: { tours }
        })
    }
    catch (err) {
        next(err);
    }
}

exports.getTour = async (req, res, next) => {
    try {
        const tour = await getTourService(req.params.id);

        successResponse(res, {
            status: 200,
            message: "single tour returned",
            payload: { tour }
        })
    }
    catch (err) {
        next(err);
    }
}

exports.getToursByUser = async (req, res, next) => {
    try {
        const tours = await getToursByUserService(req.params.id);

        successResponse(res, {
            status: 200,
            message: "user tours returned",
            payload: { tours }
        })
    }
    catch (err) {
        next(err);
    }
}

exports.deleteTour = async (req, res, next) => {
    try {
        const tour = await getTourService(req.params.id);

        if (!tour)
            throw createError(404, "tour is not exist");

        const result = await deleteTourService(req.params.id);

        if (result.deletedCount === 0)
            throw createError(400, "failed to delete the tour");

        successResponse(res, {
            status: 200,
            message: "tour deleted successfully",
            payload: { result }
        })
    }
    catch (err) {
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
        
        const result = await updateTourService(req.params.id, data);

        if (result.matchedCount === 0)
            throw createError(400, "failed to update the tour");

        successResponse(res, {
            status: 200,
            message: "tour updated successfully",
            payload: { result }
        })
    }
    catch (err) {
        next(err)
    }
}