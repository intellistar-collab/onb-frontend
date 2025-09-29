import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "../ui/skeleton";
import Avatar from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const LoginButton = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleLogin = () => {
    router.push("/login");
  };
  const handleSignup = () => {
    router.push("/signup");
  };

  const handleLogout = () => {
    authClient.signOut();
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (session?.user?.name) {
      return session.user.name.split(" ").map(n => n[0]).join("").toUpperCase();
    }
    if (session?.user?.username) {
      return session.user.username.substring(0, 2).toUpperCase();
    }
    if (session?.user?.email) {
      return session.user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };
  if (isPending) {
    return (
      <div className="bg-gray-500/40 rounded-md p-1 gap-2">
        <Skeleton className="h-9 w-16 bg-gray-600/50" />
        <Skeleton className="h-9 w-16 bg-gray-600/50" />
      </div>
    );
  }

  if (session) {
    return (
      <div className="bg-gray-500/40 rounded-md p-1 gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <Avatar initials={getUserInitials()} size="sm" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-800 border-gray-700">
            <DropdownMenuItem
              className="text-white hover:bg-gray-700 cursor-pointer"
              onClick={() => router.push('account')}
            >
              ACCOUNT
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-white hover:bg-gray-700 cursor-pointer"
              onClick={handleLogout}
            >
              LOG OUT
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="bg-gray-500/40 rounded-md p-1 gap-2">
      <Button variant="ghost" onClick={handleLogin}>
        SIGN IN
      </Button>
      <Button variant="secondary" onClick={handleSignup}>
        SIGN UP
      </Button>
    </div>
  );
};

export default LoginButton;
