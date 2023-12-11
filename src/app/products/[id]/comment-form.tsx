"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { auth, useUser } from "@clerk/nextjs";
import Link from "next/link";

const commentFormSchema = z.object({
  commentText: z
    .string()
    .min(10, {
      message: "Comment must be at least 10 characters.",
    })
    .max(500, {
      message: "Comment must not be longer than 500 characters.",
    }),
});

export type CommentFormValues = z.infer<typeof commentFormSchema>;

export function CommentForm({ productId }: { productId: number }) {
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      commentText: "",
    },
  });

  const { commentText } = form.watch();

  async function onSubmit(values: CommentFormValues) {
    try {
      await fetch("/api/products/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          productId,
        }),
      });

      toast({
        description: "Your comment has been submitted!",
      });
    } catch (error) {
      toast({
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="commentText"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Write a comment..." {...field} />
              </FormControl>
              <FormDescription>{commentText.length}/500</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Submit
        </Button>
      </form>
    </Form>
  );
}
