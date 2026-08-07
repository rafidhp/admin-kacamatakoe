"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <div>ini dashboard</div>
      <Button
        onClick={() =>
          signOut({
            redirectTo: "/",
          })
        }
      >
        Logout
      </Button>
    </div>
  )
}