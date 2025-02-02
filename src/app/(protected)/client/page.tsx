"use client";

import { UserInfo } from "@/components/auth/user-info";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import React from "react";
import Navbar from "../_components/navbar";

const ClientPage = () => {
  const user = useCurrentUser();

  return (
    <div>
        <Navbar />
      <UserInfo user={user} label="Client component" />
    </div>
  );
};

export default ClientPage;
