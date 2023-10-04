const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const uploads = require("../utils/multer");
const {
    createTour,
    getTours,
    getTour,
    getToursByUser,
    deleteTour,
    updateTour
} = require("../controllers/tour.controller");

router.post("/create-tour", verifyToken, uploads.single("image"), createTour);
router.get("/", getTours);
router.get("/:id", getTour);
router.delete("/:id", verifyToken, deleteTour);
router.patch("/:id", verifyToken, uploads.single("image"), updateTour);
router.get("/user-tours/:id", verifyToken, getToursByUser);

module.exports = router;