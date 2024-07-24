"use client";

import { useParams } from "next/navigation";
import React from "react";

export default function FileIdPage() {
  const params = useParams<{ fileId: string }>();

  return <div>{params.fileId}</div>;
}
