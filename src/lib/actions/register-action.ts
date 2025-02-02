"use server"

import { RegisterSchema } from "@/schemas"
import { z } from "zod"
import bcrypt from "bcryptjs";
import { db } from "../db";
import { generateVerificationToken } from "../tokens";
import { sendEmail } from "./sendEmail.action";


export const registerUser=async(values:z.infer<typeof RegisterSchema>)=>{
    const validation = RegisterSchema.safeParse(values);

    if(!validation.success){
        return {error:"Invalid credentials"}
    };
    const {email,name,password} = validation.data;
    const hashedPassword = await bcrypt.hash(password,10);

    const existingUser= await db.user.findUnique({
        where:{
            email,
        }
    });

    if(existingUser){
        return {error:"Email already in use!"}
    }

    await db.user.create({
        data:{
            name,
            email,
            password:hashedPassword,
        }
    });
    const verificationToken = await generateVerificationToken(email);

    //send Email
    const subject="Verify Your email address"
    const htmlmsg="to confirm email."

   await sendEmail(
     verificationToken.email,
     verificationToken.token,
     subject,
     htmlmsg
   );

    return {success:"Confirmation email sent!"}
}