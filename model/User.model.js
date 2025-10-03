import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userName: String,
        password: String,
        email: String,
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationToken: String,
        passwordResetToken: String,
        passwordResetExpiry: Date,


    }, { timestamps: true })


const User = mongoose.model("User", userSchema);

export default User;