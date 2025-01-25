import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ComingSoon = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email }]);

      if (error) throw error;

      toast.success("Thank you for subscribing! We'll keep you updated.");
      setEmail("");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-50 px-4 sm:px-6">
      <div className="max-w-md w-full p-4 sm:p-6 space-y-6 sm:space-y-8 text-center animate-fadeIn">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight leading-none">
              Campus Connect
            </h1>
            <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary animate-bounce" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Coming Soon
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-sm mx-auto">
            Connect with talented students, collaborate on amazing projects, and build your portfolio together.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full bg-white/80 rounded-lg p-4">
          <AccordionItem value="what-is-campus-connect" className="border-none">
            <AccordionTrigger className="text-lg font-semibold text-gray-900">
              What is Campus Connect?
            </AccordionTrigger>
            <AccordionContent className="text-left text-gray-600 leading-relaxed">
              Campus Connect is a one-of-a-kind platform that connects students like never before. It breaks down barriers by allowing students to collaborate across majors, outsource tasks, and showcase their talents all within their own campus community. Whether it's a business student needing a website built, an international student offering graphic design services, or a team working on a startup idea, Campus Connect brings peers together to create opportunities that would otherwise be out of reach. With its portfolio feature, students can prove their abilities and show what they're capable of, leveling the playing field and fostering innovation in a way no other platform can.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="h-1 w-20 bg-gradient-to-r from-primary via-blue-600 to-purple-600 mx-auto rounded-full" />

        <div className="space-y-3 sm:space-y-4">
          <p className="text-xs sm:text-sm text-gray-500">
            Be the first to know when we launch. Subscribe to our newsletter.
          </p>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              disabled={isSubmitting}
            />
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Subscribing..." : "Notify Me"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;