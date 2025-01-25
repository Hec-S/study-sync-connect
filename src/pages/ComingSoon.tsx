import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { GraduationCap, Sparkles } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 sm:px-6 py-12 sm:py-16">
      <div className="max-w-4xl w-full space-y-12 sm:space-y-16 animate-fadeIn">
        {/* Hero Section */}
        <div className="text-center space-y-8">
          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 animate-pulse" />
            <div className="relative">
              <div className="inline-flex items-center justify-center gap-3 sm:gap-4 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-300">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                  Campus Connect
                </h1>
                <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 text-primary animate-bounce" />
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Coming Soon
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Connect with talented students, collaborate on amazing projects, and build your portfolio together.
            </p>
          </div>
        </div>

        {/* What is Campus Connect Section */}
        <div className="w-full max-w-3xl mx-auto transform hover:-translate-y-1 transition-all duration-300">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="what-is-campus-connect" className="border-2 rounded-2xl bg-white/70 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300">
              <AccordionTrigger className="px-8 py-6 text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent hover:text-primary transition-colors text-center group">
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>What is Campus Connect?</span>
                  <Sparkles className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-8 text-gray-600 leading-relaxed text-lg text-center">
                <div className="space-y-4">
                  <p>
                    Campus Connect is a one-of-a-kind platform that connects students like never before. It breaks down barriers by allowing students to collaborate across majors, outsource tasks, and showcase their talents all within their own campus community.
                  </p>
                  <p>
                    Whether it's a business student needing a website built, an international student offering graphic design services, or a team working on a startup idea, Campus Connect brings peers together to create opportunities that would otherwise be out of reach.
                  </p>
                  <p className="font-medium text-primary">
                    With its portfolio feature, students can prove their abilities and show what they're capable of, leveling the playing field and fostering innovation in a way no other platform can.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Decorative Separator */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="px-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
              <div className="h-2 w-2 rounded-full bg-primary/50 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="space-y-8 text-center">
          <div className="space-y-3">
            <p className="text-lg sm:text-xl text-gray-700 font-medium">
              Be the first to know when we launch.
            </p>
            <p className="text-sm sm:text-base text-gray-500">
              Subscribe to our newsletter for updates.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-blue-500/30 to-purple-500/30 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative h-14 text-lg bg-white/80 backdrop-blur-sm border-gray-200 focus:border-primary/50 focus:ring-primary/50 transition-all duration-300 text-center rounded-lg"
                disabled={isSubmitting}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-14 text-lg bg-gradient-to-r from-primary via-blue-600 to-purple-600 hover:opacity-90 transition-opacity duration-300 rounded-lg shadow-lg hover:shadow-xl"
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