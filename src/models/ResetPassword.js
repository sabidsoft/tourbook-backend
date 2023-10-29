const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const ResetPasswordSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    resetPasswordToken: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        expires: 3600,
        default: Date.now
    }
});

// hashing resetPasswordToken
ResetPasswordSchema.pre('save', async function(next){
    this.resetPasswordToken = bcrypt.hashSync(this.resetPasswordToken, 10);
    next();
});

// compare resetPasswordToken
ResetPasswordSchema.methods.compareToken = async function(resetPasswordToken){
    const isMatchedResetPasswordToken = bcrypt.compareSync(resetPasswordToken, this.resetPasswordToken);
    return isMatchedResetPasswordToken;
};

const ResetPassword = model('Reset_Password', ResetPasswordSchema);

module.exports = ResetPassword;