"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import LoginForm from "./login-form";
interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "redirect" | "modal";
  asChild?: boolean;
}

const LoginButton = ({
  children,
  mode = "redirect",
  asChild,
}: LoginButtonProps) => {
  const router = useRouter();

  if (mode === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className=" p-0 w-auto bg-transparent border-none">
            <DialogTitle>This is an Login form</DialogTitle>
          <LoginForm />
        </DialogContent>
      </Dialog>
    );
  }
  const onClick = () => {
    router.push("/auth/login");
  };

  return (
    <span onClick={onClick} className=" cursor-pointer">
      {children}
    </span>
  );
};

export default LoginButton;
