"use client";

import React, { useState, useTransition } from "react";
import CardWrapper from "./card-wrapper";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FromError } from "../form-error";
import { FormSuccess } from "../form-success";
import { resetPassword } from "@/lib/actions/reset-password.action";

const ResetForm = () => {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver:zodResolver(ResetSchema),
        defaultValues:{
            email:""
        }
    });

    const onSubmit=(values:z.infer<typeof ResetSchema>)=>{
        setError("");
        setSuccess("");
        startTransition(() => {
            resetPassword(values)
              .then((data) => {
                setSuccess(data?.success);
                setError(data?.error);
              })
              .catch(() => {
                setError("Something went wrong!");
              });
          });
    }

  return (
    <CardWrapper
    headerLabel="Forgot your Password"
    backButtonLabel="Back to login"
    backButtonHref="/auth/login"
    >
        <Form {...form}>
            <form action="" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <FormField
                    control={form.control}
                    name="email"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                {...field}
                                disabled={isPending}
                                type="email"
                                placeholder="johndoe@example.com"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                <FromError message={error}/>
                <FormSuccess message={success}/>
                <Button 
                disabled={isPending}
                variant={"default"}
                type="submit"
                className="w-full"
                >
                    Send reset email
                </Button>
            </form>
        </Form>
    </CardWrapper>
  );
};

export default ResetForm
