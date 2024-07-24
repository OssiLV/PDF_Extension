import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <div className="p-4">{children}</div>
    </div>
  );
}
