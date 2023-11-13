import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';


connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;

        console.log(reqBody);

        // check if user doesn't exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ status: 400, error: "User doesn't exists" });
        }

        // check if password is correct
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ status: 400, error: "Invalid password" });
        }

        // create token data
        const tokenData = {
            _id: user._id,
            email: user.email,
            username: user.username,
        };

        // create token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '1d' });

        // create nextjs response
        const response = NextResponse.json({
            message: "User logged in successfully",
            success: true,
        });
        response.cookies.set("token", token, {
            httpOnly: true,
        });

        return response;


    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}