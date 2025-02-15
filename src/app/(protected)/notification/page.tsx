'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NotificationSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";

const NotificationPage = () => {
  const form = useForm<z.infer<typeof NotificationSchema>>({
    resolver: zodResolver(NotificationSchema),
    defaultValues: {
      token: "",
      title: "",
      body: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof NotificationSchema>) => {
   const res = await axios.post("/api/pushNotification", values);
   if(res.data.success){
    toast.success('Notification sent successfully');
   }else{
    toast.error('Failed to send notification');
   }
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className=" text-2xl font-semibold text-center">Send Notification</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Token" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Title" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="body" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Send Notification</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NotificationPage;
