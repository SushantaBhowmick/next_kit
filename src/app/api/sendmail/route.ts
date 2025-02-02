import { sendEmail } from "@/lib/actions/sendEmail.action";
import { NextResponse } from "next/server";


export async function POST(req:Request){
    const {email,token}=await req.json();

    if (!email || !token) {
        return NextResponse.json({ error: "Missing fields!" }, { status: 400 });
      }

    const response = await sendEmail(email,token);

    return NextResponse.json(response)
}