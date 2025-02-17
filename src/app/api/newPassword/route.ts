import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";


export async function POST(req:Request){
    try {
        const {token,password} = await req.json();
        if (!token) return NextResponse.json({ success: false, error: "Missing Token" });
        if(!password) return NextResponse.json({ success: false, error: "Missing Password" });

        const existingToken = await getPasswordResetTokenByToken(token);
        if(!existingToken) return NextResponse.json({ success: false, error: "Invalid Token" });

        const hasExpired = new Date(existingToken.expires) < new Date();
        if(hasExpired) return NextResponse.json({ success: false, error: "Token has expired" });

        const existingUser = await getUserByEmail(existingToken.email);
        if(!existingUser) return NextResponse.json({ success: false, error: "Email does not exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.user.update({
            where:{
                id:existingUser.id,
            },
            data:{
                password:hashedPassword,
            }
        })

        await db.passwordResetToken.delete({
            where:{
                id:existingToken.id,
            }
        })

        return NextResponse.json({
            success: true,
            message: "Password updated successfully! go back to login",
          });

    } catch (error) {
        return NextResponse.json({ success: false, error }); 
    }
}