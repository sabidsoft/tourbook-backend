const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const uploads = require("../utils/multer");
const {
    createTour,
    getTours,
    getTour,
    deleteTour,
    updateTour,
    likeTour,
} = require("../controllers/tour.controller");

router.get("/", getTours);
router.get("/:tourId", getTour);
router.post("/", verifyToken, uploads.single("image"), createTour);
router.delete("/:tourId", verifyToken, deleteTour);
router.patch("/:tourId", verifyToken, uploads.single("image"), updateTour);
router.patch("/like/:tourId", verifyToken, likeTour)

module.exports = router;