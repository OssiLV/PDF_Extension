"use client";
import { Button } from "@/components/ui/button";
import UploadFileComponent from "@/components/upload-file/upload-file";
import Link from "next/link";
import React from "react";

export default function SplitByBookmarkPage() {
  return (
    <div>
      <Button asChild variant="link">
        <Link href="/">Go back</Link>
      </Button>
      <div className="flex justify-center items-center py-32">
        <div className="py-6  px-12 rounded-lg border-2 border-dashed w-96 h-56">
          <UploadFileComponent />
        </div>
      </div>
    </div>
  );
}
