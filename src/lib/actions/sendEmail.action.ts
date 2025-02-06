"use server";
import nodemailer from "nodemailer";

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendEmail = async (
  email: string,
  token: string,
  link:string,
  subject: string,
  htmlmsg: string,
) => {
  const confirmLink = `${domain}/auth/${link}?token=${token}`;
  try {

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html: `<p>Click <a style="color:blue; text-decoration:underline;" href="${confirmLink}">here   </a>${htmlmsg}</p>`,
    };
    await transport.sendMail(mailOptions);
    console.log("Email sended");
    return { success: true, message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send email." };
  }
};
