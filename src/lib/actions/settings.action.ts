"use server"
import * as z from "zod";
import { db } from "../db";
import { SettingsSchema } from "@/schemas";
import { currentUser } from "../auth";
import { getUserByEmail, getUserByID } from "@/data/user";
import { generateVerificationToken } from "../tokens";
import { sendVerificationEmail } from "../mail";
import bcrypt from "bcryptjs";
import { imageUPloader } from "@/utils/imageUploader";

export const settings = async(values:z.infer<typeof SettingsSchema>)=>{
    const user = await currentUser();
    let imageUrl = values.image;

    if (!user) {
      return { error: "Unauthorized!" };
    }

    // Check if the user exists in the database
  const dbuser = await getUserByID(user.id!);
  if (!dbuser) {
    return { error: "Unauthorized!" };
  }

  if (user?.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" };
    }

    const verificationToken = await generateVerificationToken(values.email);
    console.log("GENERATING TOKEN");

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    console.log("SENDING EMAIL");
    return { success: "Verification email sent!" };
  }

  if (values.password && values.newPassword && dbuser.password) {
    const passwordMatch = await bcrypt.compare(
      values.password,
      dbuser.password
    );

    if (!passwordMatch) {
        return { error: "Invalid Password!" };
      }
  
      const hashedPassword = await bcrypt.hash(values.newPassword, 10);
  
      values.password = hashedPassword;
      values.newPassword = undefined;
    }
  
    if (!values.name) {
        return { error: "Name cannot be empty!" };
      }

      //upload image
      if(imageUrl){
        imageUrl=await imageUPloader(imageUrl);
        if(!imageUrl){
          return {error:"Image upload failed!"};
        }
        values.image=imageUrl;
      }
      // Update the user
      await db.user.update({
        where: { id: dbuser.id },
        data: {
          ...values,
        },
      });
    
      return { success: "Settings updated!" };

}