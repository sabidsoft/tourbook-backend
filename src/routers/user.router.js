const router = require("express").Router();
const uploads = require("../utils/multer");
const {
    signUp,
    signIn,
    updateUser,
    changePassword,
    getUser,
    forgotPassword,
    resetPassword
} = require("../controllers/user.controller");
const verifyToken = require("../middlewares/verifyToken");

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/:userId", verifyToken, getUser)
router.patch("/:userId", verifyToken, uploads.single("avatar"), updateUser);
router.post("/change-password", verifyToken, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;