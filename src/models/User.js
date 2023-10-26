const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        required: [true, "Firstname is required"],
        minLength: [3, "Firstname is too short, minimum 3 characters long."],
        maxLength: [30, "Firstname is too big, maximum 30 characters long"]
    },

    lastName: {
        type: String,
        trim: true,
        required: [true, "Lastname is required"],
        minLength: [3, "Lastname is too short, minimum 3 characters long."],
        maxLength: [30, "Lastname is too big, maximum 30 characters long"]
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: [true, "Email is required"],
        validate: {
            validator: (value) => {
                const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                const isEmail = pattern.test(value);
                return isEmail;
            },
            message: "Invalid email address"
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password should be at least 6 characters long."],
    },
    googleId: {
        type: String,
        required: false
    },
    id: {
        type: String
    }
}, {
    timestamps: true
})

// hashing password
userSchema.pre("save", function (next) {
    this.password = bcrypt.hashSync(this.password, 10);
    next();
})

// comparing password
userSchema.methods.comparePassword = function (password, hashPassword){
    const isMatchedPassword = bcrypt.compareSync(password, hashPassword);
    return isMatchedPassword;
}

const User = model("User", userSchema);

module.exports = User;