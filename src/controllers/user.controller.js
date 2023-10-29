const createError = require("http-errors");
const { generateToken } = require("../utils/generateToken");
const { successResponse } = require("../utils/response");
const { signupService, getUserByEmail, updateUserService, getUserById } = require("../services/user.service");
const cloudinary = require("../utils/cloudinary");
const bcrypt = require("bcryptjs");
const ResetPassword = require("../models/ResetPassword");
const { createRandomBytes } = require("../utils/createRandomBytes");
const nodemailer = require("nodemailer");
const { resetPassworMailTemplates, resetPasswordSuccedMailTemplates } = require("../utils/mailTemplates");
const domain = require("../utils/domain");

exports.signUp = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const emailValidationPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!firstName)
            throw createError(400, "Firstname is required.");

        if (firstName.length < 3)
            throw createError(400, "Firstname is too short.");

        if (firstName.length > 16)
            throw createError(400, "Firstname is too big.");

        if (!lastName)
            throw createError(400, "Lastname is required.");

        if (lastName.length < 3)
            throw createError(400, "Lastname is too short.");

        if (lastName.length > 16)
            throw createError(400, "Lastname is too big.");

        if (!email)
            throw createError(400, "Email is required.");

        if (!emailValidationPattern.test(email))
            throw createError(400, "Invalid email address.");

        if (!password)
            throw createError(400, "Password is required.");

        if (password.length < 6)
            throw createError(400, "Password should be at least 6 characters long.");

        if (password.length > 40)
            throw createError(400, "Password is too long.");

        const isUserExist = await getUserByEmail(email);

        if (isUserExist)
            throw createError(400, "User allready exist.");

        const user = await signupService(req.body);

        const { password: pass, ...userInfoWithoutPassword } = user.toObject();

        const token = generateToken({ email }, process.env.JWT_SECRET_KEY, "365d");

        successResponse(res, {
            status: 200,
            message: "Sign up successfull.",
            payload: { user: userInfoWithoutPassword, token }
        })
    }
    catch (err) {
        next(err);
    }
}

exports.signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const emailValidationPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!email)
            throw createError(400, "Please provide your email address.");

        if (!emailValidationPattern.test(email))
            throw createError(400, "Invalid email address.");

        if (!password)
            throw createError(400, "Please provide your password.");

        const user = await getUserByEmail(email);

        if (!user)
            throw createError(400, "No user found. Please create an account first.");

        const isMatchedPassword = user.comparePassword(password, user.password);

        if (!isMatchedPassword)
            throw createError(400, "Your email or password isn't correct.");

        const { password: pass, ...userInfoWithoutPassword } = user.toObject();

        const token = generateToken({ email }, process.env.JWT_SECRET_KEY, "365d");

        successResponse(res, {
            status: 200,
            message: "Sign in successfull.",
            payload: { user: userInfoWithoutPassword, token }
        })
    }
    catch (err) {
        next(err);
    }
}

exports.getUser = async (req, res, next) => {
    try {
        const user = await getUserById(req.params.userId);

        if (!user)
            throw createError(404, "User not found.");

        successResponse(res, {
            status: 200,
            message: "User found successfully.",
            payload: { user }
        });
    }
    catch (err) {
        next(err);
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const { firstName, lastName, email } = req.body;
        const emailValidationPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!firstName)
            throw createError(400, "Firstname is required.");

        if (firstName.length < 3)
            throw createError(400, "Firstname is too short.");

        if (firstName.length > 16)
            throw createError(400, "Firstname is too big.");

        if (!lastName)
            throw createError(400, "Lastname is required.");

        if (lastName.length < 3)
            throw createError(400, "Lastname is too short.");

        if (lastName.length > 16)
            throw createError(400, "Lastname is too big.");

        if (!email)
            throw createError(400, "Email is required.");

        if (!emailValidationPattern.test(email))
            throw createError(400, "Invalid email address.");

        let cloudinaryImageResult;
        let data;

        if (req.file) {
            const { path } = req.file;
            cloudinaryImageResult = await cloudinary.uploader.upload(path, {
                folder: "tourbook/user_avatar",
                width: 150,
                height: 150,
                crop: 'fill'
            });
        }

        if (cloudinaryImageResult) {
            data = {
                firstName,
                lastName,
                email,
                avatar: cloudinaryImageResult.secure_url,
            }
        } else {
            data = {
                firstName,
                lastName,
                email,
                avatar: req.body.avatar
            }
        }

        const result = await updateUserService(req.params.userId, data);

        if (result.matchedCount === 0)
            throw createError(400, "Failed to update the user profile");

        successResponse(res, {
            status: 200,
            message: "Profile updated successfully",
            payload: { result }
        })
    }
    catch (err) {
        next(err);
    }
}

exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword)
            throw createError(400, "Current password is required.");

        if (!newPassword)
            throw createError(400, "New password is required.");

        const user = await getUserByEmail(req.user.email);

        if (!user)
            throw createError(400, "User not found.");

        const isMatchedPassword = user.comparePassword(currentPassword, user.password);

        if (!isMatchedPassword)
            throw createError(400, "Your current password is wrong.");

        if (currentPassword === newPassword)
            throw createError(400, "New password must be different.");

        if (newPassword.length < 6)
            throw createError(400, "New password should be at least 6 characters long.");

        // Hash the new password
        const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

        // Update the user's password
        const result = await updateUserService(user._id, { password: hashedNewPassword });

        if (result.matchedCount === 0)
            throw createError(400, "Failed to change your password.");

        successResponse(res, {
            status: 200,
            message: "Password changed successfully.",
            payload: { result }
        })
    }
    catch (err) {
        next(err);
    }
}

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const emailValidationPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // email validation
        if (!email)
            throw createError(400, "Email is required.");

        if (!emailValidationPattern.test(email))
            throw createError(400, "Invalid email address.");

        // checking user exist or not
        const user = await getUserByEmail(email);
        if (!user)
            throw createError(400, "User not found.");

        // find password reset token document with owner field
        const document = await ResetPassword.findOne({ owner: user._id });
        if (document)
            throw createError(400, "Already we have sent you an email. Please check your inbox or spam folder.");

        // generate resetPasswordToken
        const resetPasswordToken = await createRandomBytes();

        const newData = new ResetPassword({
            owner: user._id,
            resetPasswordToken
        });

        await newData.save();

        // create a transporter using Gmail service
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            }

        });

        // send the email
        transporter.sendMail({
            from: process.env.EMAIL_ADDRESS,
            to: user.email,
            subject: "Reset your Tourbook account password",
            html: resetPassworMailTemplates(`${domain}/reset-password?resetPasswordToken=${resetPasswordToken}&userId=${user._id}`)
        })

        successResponse(res, {
            status: 200,
            message: "Email sent successfully.",
        })
    }
    catch (err) {
        next(err);
    }
}

exports.resetPassword = async (req, res, next) => {
    try {
        const { password } = req.body;
        const { resetPasswordToken, userId } = req.query;

        if (!password)
            throw createError(400, "Password is required.");

        if (password.length < 6)
            throw createError(400, "Password should be at least 6 characters long.");

        if (password.length > 40)
            throw createError(400, "Password is too long.");

        if (!resetPasswordToken)
            throw createError(400, "Invalid request, reset password token is required.");

        if (!userId)
            throw createError(400, "Invalid request, user id is required.");

        const user = await getUserById(userId);
        if (!user)
            throw createError(400, "User not found.");

        const document = await ResetPassword.findOne({ owner: user._id })
        if (!document)
            throw createError(400, "Reset password token is not found.");

        const isMatchedResetPasswordToken = await document.compareToken(resetPasswordToken);
        if (!isMatchedResetPasswordToken)
            throw createError(400, "Reset password token is not matched, Please try again.");

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Update the user's password
        const result = await updateUserService(user._id, { password: hashedPassword });

        if (result.matchedCount === 0)
            throw createError(400, "Failed to reset your password.");

        await ResetPassword.findOneAndDelete({ owner: user._id });

        // create a transporter using Gmail service
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            }

        });

        // send the email
        transporter.sendMail({
            from: process.env.EMAIL_ADDRESS,
            to: user.email,
            subject: "Tourbook account pasword reset successful.",
            html: resetPasswordSuccedMailTemplates()
        })

        successResponse(res, {
            status: 200,
            message: "Password reset successful"
        })
    }
    catch (err) {
        next(err);
    }
}


