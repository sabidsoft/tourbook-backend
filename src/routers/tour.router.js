const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const {
    createTour,
    getTours,
    getTour,
    getToursByUser,
    deleteTour,
    updateTour
} = require("../controllers/tour.controller");

router.post("/create-tour", verifyToken, createTour);
router.get("/tours", verifyToken, getTours);
router.get("/tours/:id", verifyToken, getTour);
router.delete("/tours/:id", verifyToken, deleteTour);
router.patch("/tours/:id", verifyToken, updateTour);
router.get("/tours/user-tours/:id", verifyToken, getToursByUser);

module.exports = router;