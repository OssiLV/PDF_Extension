"use client";
import React, { useState } from "react";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
const ACCEPTED_FILE_TYPES = ["application/pdf"];
const formSchema = z.object({
  file: z
    .any()
    .refine((file) => file, { message: "File is required" })
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file?.type), {
      message: "Just accept .pdf file",
    }),
});

export default function UploadFileComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      api
        .post("/api/upload", data)
        .then((res) => {
          const { fileUrl, origin, type, uuid } = res.data;
          router.push(`/split-by-bookmark/${uuid}`);
        })
        .catch((error) => {
          setIsLoading(false);
          throw error;
        });
    } catch (error) {
      throw error;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <FormField
          control={form.control}
          name="file"
          render={({ field: { value, onChange, ...fieldProps } }) => {
            return (
              <FormItem>
                <FormLabel className="cursor-pointer">File</FormLabel>
                <FormControl className="cursor-pointer">
                  <Input
                    className="cursor-pointer"
                    onChange={(event) =>
                      onChange(event.target.files && event.target.files[0])
                    }
                    type="file"
                    accept="application/pdf"
                    disabled={isLoading}
                    {...fieldProps}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  File will be delete when complete
                </FormDescription>
              </FormItem>
            );
          }}
        />
        <Button disabled={isLoading} type="submit" className="mt-2 w-full">
          {isLoading ? <LoaderCircle className="animate-spin" /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
