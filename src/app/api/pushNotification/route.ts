import { sendNotification } from "@/utils/sendNotification";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token, title, body } = await req.json();

    const response = await sendNotification(token, title, body);

    return NextResponse.json({ success: true, response });
    
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
