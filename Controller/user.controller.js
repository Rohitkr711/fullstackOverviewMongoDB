import User from "../model/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

dotenv.config();

export const rootController = async (req, res) => {
    console.log("Root controller", req.body);
    res.send("Root controller");

}

export const registerController = async (req, res) => {
    // ##Algo for this route -
    // -> Get data
    // -> validate data
    // -> check if user already exist
    // -> create a user in DB
    // -> create verification token
    // -> save token into DB
    // -> send token through mail to user
    // -> send success status to user
    console.log("Inside register controller");


    const { name: userName, email, password } = req.body;
    if (!userName || !email || !password) {
        return res.status(400).json({
            message: "All fields are required",
            success: false,
        })
    }

    try {

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(409).json({
                message: "User already exists",
                success: true,
            });
        }

        const user = await User.create({
            userName,
            email,
            password,
        })
        if (!user) {
            return res.status(500).json({
                message: "failed to register user : try again!",
                success: true,
            });
        }

        const userVerificationToken = crypto.randomBytes(20).toString('hex')
        console.log(userVerificationToken);

        user.verificationToken = userVerificationToken;
        const saveresponse = await user.save();

        console.log("token saved into DB");


        // SEND MAIL SERVICE
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAILTRAP_USERNAME,
                pass: process.env.MAILTRAP_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.MAILTRAP_SENDEREMAIL,
            to: user.email,
            subject: "Verify your email",
            text: `Please click the following link: ${process.env.BASE_URL}/api/v1/users/verify/${userVerificationToken}`, // plain‑text body
            html: "<b>Hello world?</b>", // HTML body
        }


        const info = await transporter.sendMail(mailOptions);
        if (!info.messageId) {
            console.log("Mail not sent");
        }

        console.log("Mail service added");


        res.status(201).json({
            message: "Mail sent successfully, New user got registered",
            success: true,
            MailSentFrom: info.envelope.from,
            MailSentTo: info.envelope.to[0],
        });


    } catch (error) {
        console.log("Error:", error);

        return res.status(400).json({
            message: "User not registered try after some time",
            error: error,
            success: true,
        });

    }


    console.log("outside register controller");

    // res.send("User Registered");
}

export const verifyController = async (req, res) => {

    // #Algo for verify controller
    // Get data from url
    // Validate token
    // find user based on token
    // if not
    // set isVerified field to true
    // remove verification token
    // save
    // return response

    console.log("Inside verify controller");


    const { token } = req.params;

    if (!token) {
        res.status(400).json({
            message: "Invalid token",
        })
    }
    try {

        const user = await User.findOne({ verificationToken: token })
        if (!user) {
            res.status(400).json({
                message: "Invalid token",
                success: false,
            })
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.status(200).json({
            message: "User verified successfully",
            success: true,
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: true,
        })
    }


}

export const loginController = async (req, res) => {

    console.log("Inside login");
    
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "All fields are required",
            success: false,
        })
    }

    try {

        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({
                message: "Invalid username or password",
                seccess: false,
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({
                message: "Invalid username or password",
                seccess: false,
            })
        }
        if (!user.isVerified) {
            res.status(400).json({
                message: "user isn't verified",
                seccess: false,
            })
        }

        // JWT TOKEN
        const token = JWT.sign(
            { id: user._id, role: user.role },
            'shhhh',
            { expiresIn: '24h' },
        )

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000

        }

        res.cookie('test', token, cookieOptions);

        res.status(200).json({
            message: "LoggedIn Successfully",
            success: true,
            user: {
                id: user._id,
                name: user.email,
                role: user.role,
            }
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            seccess: false,
            error: error.message,
        })
    }
}