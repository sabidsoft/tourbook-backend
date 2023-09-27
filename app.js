// modules
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const limiter = require("./src/utils/limiter");
const createError = require("http-errors")
const connectDatabase = require("./src/configs/db");
const { errorResponse } = require("./src/utils/response");
const userRouter = require("./src/routers/user.router");
const tourRouter = require("./src/routers/tour.router");

// variables
const app = express();
const PORT = process.env.PORT || 8080;

// application level middlewares
app.use(limiter);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// router level middlewares
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tour", tourRouter);

// home route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running"
    });
});

// client error handling middleware
app.use((req, res, next) => {
    const err = createError(404, "route not found");
    next(err);
});

// server error handling middleware
app.use((err, req, res, next) => {
    errorResponse(res, {
        status: err.status,
        message: err.message
    })
});

// app listener
app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`)
})

// database connection
connectDatabase();