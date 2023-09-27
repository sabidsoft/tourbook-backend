const multer = require("multer");

const storage = multer.diskStorage({});
const uploads = multer({ storage });

module.exports = uploads;