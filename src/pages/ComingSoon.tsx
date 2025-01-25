import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";

const ComingSoon = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Thank you for subscribing! We'll keep you updated.");
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-50">
      <div className="max-w-md w-full p-6 space-y-8 text-center animate-fadeIn">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Campus Connect
            </h1>
            <GraduationCap className="w-8 h-8 md:w-12 md:h-12 text-primary animate-bounce" />
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900">
            Coming Soon
          </h2>
          <p className="text-lg text-gray-600">
            We're working hard to bring you something amazing. Stay tuned!
          </p>
        </div>

        <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full" />

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Be the first to know when we launch. Subscribe to our newsletter.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
            <Button type="submit" className="w-full">
              Notify Me
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;