import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

const ComingSoon = () => {
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Thank you for subscribing! We'll keep you updated.");
      setEmail("");
      setInterest("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-50">
      <div className="max-w-md w-full p-6 space-y-8 text-center animate-fadeIn">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Coming Soon
          </h1>
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
            <Select value={interest} onValueChange={setInterest}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="What interests you most?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="projects">Finding Projects</SelectItem>
                <SelectItem value="collaboration">Team Collaboration</SelectItem>
                <SelectItem value="networking">Professional Networking</SelectItem>
                <SelectItem value="learning">Learning Opportunities</SelectItem>
              </SelectContent>
            </Select>
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