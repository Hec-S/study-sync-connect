import React from "react";
import { useNavigate } from "react-router-dom";
import { Brain, BookOpen, Calendar, Lightbulb, Target, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";

const UtepAssistantLanding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: BookOpen,
      title: "Course Assistance",
      description: "Get personalized help with course content, assignments, and study materials across all your subjects."
    },
    {
      icon: Calendar,
      title: "Study Planning",
      description: "Create effective study schedules and get reminders to help you stay on track with your academic goals."
    },
    {
      icon: Lightbulb,
      title: "Resource Recommendations",
      description: "Receive tailored suggestions for learning resources, study materials, and academic support services."
    },
    {
      icon: Target,
      title: "Progress Tracking",
      description: "Monitor your academic progress and receive insights to help you improve your performance."
    }
  ];

  return (
    <div className={`min-h-screen ${user ? 'bg-[#041E42]' : 'bg-background'}`}>
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Brain className={`w-12 h-12 ${user ? 'text-[#FF8200]' : 'text-primary'}`} />
            <h1 className={`text-4xl md:text-5xl font-bold ${user ? 'text-[#FF8200]' : 'text-primary'}`}>
              UTEP Assistant
            </h1>
          </div>
          <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${user ? 'text-white' : 'text-muted-foreground'}`}>
            Your AI-powered academic companion that helps you navigate your studies, answer questions, and achieve your educational goals.
          </p>
          <Button 
            onClick={() => navigate('/utep-assistant')}
            size="lg"
            className={user ? "bg-[#FF8200] hover:bg-[#FF8200]/90 text-white" : ""}
          >
            Get Academic Support
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Value Proposition */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className={`text-3xl font-bold text-center mb-12 ${user ? 'text-white' : 'text-foreground'}`}>
            Why Use UTEP Assistant?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className={`p-6 ${user ? 'bg-[#041E42]/80 border-[#B1B3B3]/20' : ''}`}>
              <h3 className={`text-xl font-semibold mb-4 ${user ? 'text-white' : 'text-foreground'}`}>
                24/7 Support
              </h3>
              <p className={`${user ? 'text-white/80' : 'text-muted-foreground'}`}>
                Get instant help with your academic questions anytime, anywhere, without waiting for office hours.
              </p>
            </Card>
            <Card className={`p-6 ${user ? 'bg-[#041E42]/80 border-[#B1B3B3]/20' : ''}`}>
              <h3 className={`text-xl font-semibold mb-4 ${user ? 'text-white' : 'text-foreground'}`}>
                Personalized Learning
              </h3>
              <p className={`${user ? 'text-white/80' : 'text-muted-foreground'}`}>
                Receive customized guidance and resources tailored to your specific needs and learning style.
              </p>
            </Card>
            <Card className={`p-6 ${user ? 'bg-[#041E42]/80 border-[#B1B3B3]/20' : ''}`}>
              <h3 className={`text-xl font-semibold mb-4 ${user ? 'text-white' : 'text-foreground'}`}>
                Academic Success
              </h3>
              <p className={`${user ? 'text-white/80' : 'text-muted-foreground'}`}>
                Improve your understanding of course material and boost your academic performance.
              </p>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-3xl font-bold text-center mb-12 ${user ? 'text-white' : 'text-foreground'}`}>
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature) => (
              <Card 
                key={feature.title}
                className={`p-6 ${user ? 'bg-[#041E42]/80 border-[#B1B3B3]/20' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${user ? 'bg-[#041E42]' : 'bg-primary/10'}`}>
                    <feature.icon className={`w-6 h-6 ${user ? 'text-[#FF8200]' : 'text-primary'}`} />
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold mb-2 ${user ? 'text-white' : 'text-foreground'}`}>
                      {feature.title}
                    </h3>
                    <p className={`${user ? 'text-white/80' : 'text-muted-foreground'}`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className={`mt-16 text-center p-8 rounded-2xl ${user ? 'bg-[#041E42]/60 border border-[#B1B3B3]/20' : 'bg-primary/5'}`}>
          <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${user ? 'text-[#FF8200]' : 'text-primary'}`}>
            Ready to Excel in Your Studies?
          </h3>
          <p className={`text-lg mb-6 ${user ? 'text-white' : 'text-muted-foreground'}`}>
            Get the academic support you need to succeed in your courses
          </p>
          <Button 
            onClick={() => navigate('/utep-assistant')}
            size="lg"
            className={user ? "bg-[#FF8200] hover:bg-[#FF8200]/90 text-white" : ""}
          >
            Start Learning
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default UtepAssistantLanding;
