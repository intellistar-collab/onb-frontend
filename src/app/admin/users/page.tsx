"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminUsers() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the overview page
    router.replace('/admin/users/overview');
  }, [router]);

  return null;
}