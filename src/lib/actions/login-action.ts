"use server";

import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { z } from "zod";
import { generateVerificationToken, generateTwoFactorToken } from "../tokens";
import { sendTwoFactorTokenEmail } from "../mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "../db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { sendEmail } from "./sendEmail.action";

export const loginUser = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl: string | null
) => {
  const validation = LoginSchema.safeParse(values);
  if (!validation.success) {
    return { error: "Invalid credentials!" };
  }
  const { email, password, code } = validation.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exists!" };
  }

  if (!existingUser.emailVerified) {
    console.log("email not verify")
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    const subject="Verify Your email address"
     const htmlmsg="to confirm email."

    await sendEmail(
      verificationToken.email,
      verificationToken.token,
      subject,
      htmlmsg
    );

    return { success: "Confirmation email sent!" };
  }

  // if two factor is enabled,generate and send two factor token
  if (existingUser.isTwoFactorEnabbled && existingUser.email) {
    console.log("email is not 2FA verify")
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      // Token does not exists in the database
      if (!twoFactorToken) {
        return { error: "Invalid two factor code!" };
      }

      // Token mismatch
      if (twoFactorToken.token !== code) {
        return { error: "Invalid two factor code!" };
      }

      // Token expired
      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Two factor code expired!" };
      }

      // Token is valid
      // Delete the token from the database
      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }
      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true }; // break and show two factor form
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    console.log('Error:',error)
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "An error occurred!" };
      }
    }
    throw error;
  }
};
