"use server";

import { getUserByEmail } from "@/data/user";
import { ResetSchema } from "@/schemas";
import { z } from "zod";
import { generatePasswordResetToken } from "../tokens";
import { sendEmail } from "./sendEmail.action";

export const resetPassword = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid email!" };

  const { email } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser) return { error: "Email not found!" };

  //Generate a Password reset email
  const passwordResetToken = await generatePasswordResetToken(email);

  //send the password reset email

  const link ="new-password"
  const subject ="Reset your password"
  const htmlmsg="to reset your password."

  await sendEmail(
    passwordResetToken.email,
    passwordResetToken.token,
    link ,
    subject,
    htmlmsg
  )
  return { success: "Reset email sent! Check your inbox!" };

};
