const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require('validator')
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.length < 6) {
                throw new Error('Password is too small')
            } else if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password" ')
            }
        }
    },
    mobileNo: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }, ],

}, {
    timestamps: true
});

adminSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});
adminSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({
        _id: user._id.toString()
    }, "example");
    user.tokens = user.tokens.concat({
        token
    });
    await user.save();
    return token;
};
adminSchema.statics.findByCredentials = async (username, password) => {
    const admin = await Admin.findOne({
        username
    });
    if (!admin) {
        throw new Error("Unable to login");
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        throw new Error("Unable to login");
    }
    return admin;
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;