const createError = require("http-errors");
const { generateToken } = require("../utils/generateToken");
const { successResponse } = require("../utils/response");
const { signupService, getUserByEmail } = require("../services/user.service");

exports.signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const emailValidationPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!name)
            throw createError(401, "Name is required");

        if (name.length < 3)
            throw createError(401, "Name is too short");

        if (name.length > 30)
            throw createError(401, "Name is too big");

        if (!email)
            throw createError(401, "Email is required");

        if (!emailValidationPattern.test(email))
            throw createError(401, "Invalid email address");

        if (!password)
            throw createError(401, "Password is required");

        if (password.length < 6)
            throw createError(401, "Password should be at least 6 characters long.");

        const isUserExist = await getUserByEmail(email);

        if (isUserExist)
            throw createError(401, "user allready exist!");

        const user = await signupService(req.body);

        const token = generateToken({ email }, process.env.JWT_SECRET_KEY, "1h");

        successResponse(res, {
            status: 200,
            message: "signup successfull",
            payload: { user, token }
        })
    }
    catch (err) {
        next(err);
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email)
            throw createError(401, "Please provide your email");

        if (!password)
            throw createError(401, "Please provide your password");

        const user = await getUserByEmail(email);

        if (!user)
            throw createError(401, "No user found. Please create an account");

        const isMatchedPassword = user.comparePassword(password, user.password);

        if (!isMatchedPassword)
            throw createError(401, "Your email or password is not correct");

        const token = generateToken({ email }, process.env.JWT_SECRET_KEY, "1h");

        const { password: pass, ...userInfoWithoutPassword } = user.toObject();

        successResponse(res, {
            status: 200,
            message: "login successfull",
            payload: { user: userInfoWithoutPassword, token }
        })
    }
    catch (err) {
        next(err);
    }
}