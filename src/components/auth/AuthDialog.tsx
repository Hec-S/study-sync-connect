import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";
import { UserPlus } from "lucide-react";

export const AuthDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const handleClose = () => {
    setIsOpen(false);
    // Reset to default mode when dialog closes
    setTimeout(() => setMode("signin"), 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "signin" ? "Welcome Back!" : "Create an Account"}
          </DialogTitle>
          <DialogDescription>
            {mode === "signin"
              ? "Sign in to your Campus Connect account"
              : "Join Campus Connect to collaborate on amazing projects"}
          </DialogDescription>
        </DialogHeader>

        {mode === "signin" ? (
          <div className="space-y-4">
            <SignInForm onClose={handleClose} />
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => setMode("signup")}
              >
                Don't have an account? Sign up
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <SignUpForm onClose={handleClose} />
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => setMode("signin")}
              >
                Already have an account? Sign in
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};