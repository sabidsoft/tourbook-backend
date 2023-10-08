const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const uploads = require("../utils/multer");
const {
    createTour,
    getTours,
    getTour,
    deleteTour,
    updateTour,
} = require("../controllers/tour.controller");

router.get("/", getTours);
router.get("/:id", getTour);
router.post("/", verifyToken, uploads.single("image"), createTour);
router.delete("/:id", verifyToken, deleteTour);
router.patch("/:id", verifyToken, uploads.single("image"), updateTour);

module.exports = router;