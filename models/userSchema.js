import mongoose from "mongoose";

const members = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    live: {
        type: Boolean,
        default: false
    }
})

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    membersadded: {
        type: [members],
        default: []
    }
    ,
    createAt: {
        type: Date,
        default: Date.now()
    }
})

const UserModel = mongoose.model("user", UserSchema)
export default UserModel