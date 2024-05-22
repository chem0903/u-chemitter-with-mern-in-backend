const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    // 第一引数：データの定義
    {
        username: {
            type: String,
            required: true,
            min: 3,
            max: 25,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 6,
            max: 50,
        },
        profilePicture: {
            type: String,
            default: "",
        },
        coverPicture: {
            type: String,
            default: "",
        },
        followers: {
            type: Array,
            default: [],
        },
        followings: {
            type: Array,
            default: [],
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        description: {
            type: String,
            max: 70,
        },
        live: {
            type: String,
            max: 50
        },
    },
    // 第二引数：データ（第一引数）を格納した日時を記録
    { timestamps: true }
)

module.exports = mongoose.model("User", UserSchema)