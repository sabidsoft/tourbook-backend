const router = require("express").Router();
const {
    signUp,
    signIn,
    updateUser,
    changePassword,
} = require("../controllers/user.controller");
const verifyToken = require("../middlewares/verifyToken");

router.post("/signup", signUp);
router.post("/signin", signIn);

router.patch("/:userId", verifyToken, updateUser);
router.post("/change-password", verifyToken, changePassword);

module.exports = router;