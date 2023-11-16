import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';

export const sendMail = async ({ email, emailType, userId }: any) => {
    try {
        // create a hashed token
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        if (emailType === 'VERIFY') {
            // find user and update with verify token
            const user = await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000
            });
        } else if (emailType === 'RESET_PASSWORD') {
            // find user and update with forgot password token
            const user = await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000
            });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.TRANSPORTER_HOST,
            port: 2525,
            auth: {
                user: process.env.TRANSPORTER_USER,
                pass: process.env.TRANSPORTER_PASS
            }
        });

        const mailOptions = {
            from: '',
            to: email,
            subject: emailType === 'VERIFY' ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}"> here</a> to ${emailType === 'VERIFY' ? "verify your email" : "reset your password"}</p>
            <p>also you can copy this url into browser ${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`,
        }

        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;
    } catch (error: any) {
        throw new Error(error.message);
    }
}