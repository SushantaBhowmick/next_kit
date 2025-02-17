import { getUserByEmail } from "@/data/user";
import { sendEmail } from "@/lib/actions/sendEmail.action";
import { generatePasswordResetToken } from "@/lib/tokens";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const existingUser = await getUserByEmail(email);
    if (!existingUser)
      return NextResponse.json({ success: false, error: "User not found!" });

    //Generate a Password reset email
    const passwordResetToken = await generatePasswordResetToken(email);

    //send the password reset email
    const link = "new-password";
    const subject = "Reset your password";
    const htmlmsg = "to reset your password.";

    await sendEmail(
      passwordResetToken.email,
      passwordResetToken.token,
      link,
      subject,
      htmlmsg
    );

    return NextResponse.json({
      success: true,
      message: "Reset email sent! Check your inbox!",
    });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
