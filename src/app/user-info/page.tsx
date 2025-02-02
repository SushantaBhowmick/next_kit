"use server";
import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async () => {
  const session = await auth();

  if (!session?.user) return;

  // if(!session?.user) return;

  return (
    <div>
      <>
        <h1>NextAuth v5 + next 15</h1>
        <p>User signed in with name {session?.user.name}</p>
        <p>User signed in with email {session?.user?.email}</p>
        {session.user.image && (
          <Image src={session.user.image} alt="dp" width={48} height={48} />
        )}
      </>

      <Link href={'/'}>Go back to home</Link>
    </div>
  );
};

export default page;
