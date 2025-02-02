"use server";

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { db } from "../db";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exists!" };
  }

  //check if exists token is expired
  const hasExpired = new Date(existingToken.expires) < new Date();
  if(hasExpired){
    return {error:"Token has expired!"};
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if(!existingUser){
    return {error:"Email does not exists"};
  }

  await db.user.update({
    where:{
        id:existingUser.id,
    },
    data:{
        emailVerified:new Date(),
        email:existingToken.email,
    }
  })

  //   delete the verification token from the db
await db.verificationToken.delete({
    where:{
        id:existingToken.id
    }
})

return { success: "Email verified!" };


};
