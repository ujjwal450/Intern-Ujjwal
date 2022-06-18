const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require('validator')
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
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
    lastLogin: {
        type: Date,
        default: Date.now()
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

// userSchema.pre("save", async function(next) {
//     const user = this;
//     if (user.isModified("password")) {
//         user.password = await bcrypt.hash(user.password, 8);
//     }
//     next();
// });
userSchema.methods.generateAuthToken = async function () {
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
userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({
        username
    });
    if (!user) {
        throw new Error("Unable to login");
    }
    if (user.password !== password) {
        throw new Error("Unable to Login")
    }
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //     throw new Error("Unable to login");
    // }
    return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;