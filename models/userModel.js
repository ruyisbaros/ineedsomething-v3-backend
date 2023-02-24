const mongoose = require("mongoose")
const bcrypt = require("bcrypt")


const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "first name is required"],
        trim: true,
        text: true,
    },
    last_name: {
        type: String,
        required: [true, "last name is required"],
        trim: true,
        text: true,
    },
    username: {
        type: String,
        required: [true, "username is required"],
        trim: true,
        text: true,
        unique: true,
    },

    email: {
        type: String,
        required: [true, "email is required"],
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    picture: {
        type: String,
        trim: true,
        default:
            "https://res.cloudinary.com/dmhcnhtng/image/upload/v1643044376/avatars/default_pic_jeaybr.png",
    },
    avatarColor: { type: String, default: "teal" },
    cover: {
        type: String,
        trim: true,
        default: ""
    },
    gender: {
        type: String,
        required: [true, "gender is required"],
        trim: true,
    },
    bYear: {
        type: Number,
        required: true,
        trim: true,
    },
    bMonth: {
        type: Number,
        required: true,
        trim: true,
    },
    bDay: {
        type: Number,
        required: true,
        trim: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    friends: {
        type: Array,
        default: [],
    },
    following: {
        type: Array,
        default: [],
    },
    followers: {
        type: Array,
        default: [],
    },
    requests: {
        type: Array,
        default: [],
    },
    search: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
            },
        },
    ],
    details: {
        bio: {
            type: String,
        },
        otherName: {
            type: String,
        },
        job: {
            type: String,
        },
        workplace: {
            type: String,
        },
        highSchool: {
            type: String,
        },
        college: {
            type: String,
        },
        currentCity: {
            type: String,
        },
        hometown: {
            type: String,
        },
        relationship: {
            type: String,
            enum: ["Single", "In a relationship", "Married", "Divorced"],
        },
        instagram: {
            type: String,
        },
    },
    savedPosts: [
        {
            post: {
                type: mongoose.Schema.ObjectId,
                ref: "Post",
            },
            savedAt: {
                type: Date,
                default: new Date(),
            },
        },
    ],
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordTrue = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}
userSchema.methods.hashPassword = async function (password) {
    return bcrypt.hash(password, 10);
};

const User = mongoose.model("User", userSchema)

module.exports = User