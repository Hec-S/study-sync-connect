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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-50 px-4 sm:px-6">
      <div className="max-w-xl w-full space-y-8 sm:space-y-10 animate-fadeIn">
        <div className="text-center space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              Campus Connect
            </h1>
            <GraduationCap className="w-12 h-12 sm:w-14 sm:h-14 text-primary animate-bounce" />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Coming Soon
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
              Connect with talented students, collaborate on amazing projects, and build your portfolio together.
            </p>
          </div>
        </div>

        <div className="w-full max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="what-is-campus-connect" className="border rounded-xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
              <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-gray-900 hover:text-primary transition-colors text-center">
                What is Campus Connect?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-gray-600 leading-relaxed text-base sm:text-lg text-center">
                Campus Connect is a one-of-a-kind platform that connects students like never before. It breaks down barriers by allowing students to collaborate across majors, outsource tasks, and showcase their talents all within their own campus community. Whether it's a business student needing a website built, an international student offering graphic design services, or a team working on a startup idea, Campus Connect brings peers together to create opportunities that would otherwise be out of reach. With its portfolio feature, students can prove their abilities and show what they're capable of, leveling the playing field and fostering innovation in a way no other platform can.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-sm sm:text-base text-gray-500">
              Be the first to know when we launch.
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              Subscribe to our newsletter for updates.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 text-base sm:text-lg bg-white/80 backdrop-blur-sm border-gray-200 focus:border-primary/50 focus:ring-primary/50 transition-all duration-300 text-center"
              disabled={isSubmitting}
            />
            <Button 
              type="submit" 
              className="w-full h-12 text-base sm:text-lg bg-primary hover:bg-primary/90 transition-colors duration-300"
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