import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

type AuthMode = "signin" | "signup";

export function AuthDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("signin");

  const handleClose = () => {
    setIsOpen(false);
    setMode("signin");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Sign In</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "signin" ? "Sign In" : "Create Account"}</DialogTitle>
          <DialogDescription>
            {mode === "signin"
              ? "Sign in to your account to continue"
              : "Create a new account to get started"}
          </DialogDescription>
        </DialogHeader>
        {mode === "signin" ? (
          <>
            <SignInForm onClose={handleClose} />
            <Button
              type="button"
              variant="link"
              onClick={() => setMode("signup")}
              className="mt-2"
            >
              Don't have an account? Sign up
            </Button>
          </>
        ) : (
          <>
            <SignUpForm onClose={handleClose} />
            <Button
              type="button"
              variant="link"
              onClick={() => setMode("signin")}
              className="mt-2"
            >
              Already have an account? Sign in
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
