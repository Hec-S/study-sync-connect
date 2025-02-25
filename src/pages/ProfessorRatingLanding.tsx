import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, ThumbsUp, Users, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";

const ProfessorRatingLanding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: Star,
      title: "Anonymous Ratings",
      description: "Share your honest feedback while maintaining your privacy. Your reviews help create transparency in education."
    },
    {
      icon: ThumbsUp,
      title: "Course-Specific Feedback",
      description: "Provide detailed insights about specific courses, teaching methods, and course materials."
    },
    {
      icon: Users,
      title: "Community Insights",
      description: "Access aggregated ratings and reviews from fellow students to make informed decisions about your courses."
    },
    {
      icon: BookOpen,
      title: "Comprehensive Metrics",
      description: "Rate professors on multiple criteria including teaching effectiveness, workload, and availability."
    }
  ];

  return (
    <div className={`min-h-screen ${user ? 'bg-[#041E42]' : 'bg-background'}`}>
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Star className={`w-12 h-12 ${user ? 'text-[#FF8200]' : 'text-primary'}`} />
            <h1 className={`text-4xl md:text-5xl font-bold ${user ? 'text-[#FF8200]' : 'text-primary'}`}>
              Professor Rating
            </h1>
          </div>
          <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${user ? 'text-white' : 'text-muted-foreground'}`}>
            Make informed decisions about your education by accessing honest reviews and ratings from your fellow students.
          </p>
          <Button 
            onClick={() => navigate('/professor-rating')}
            size="lg"
            className={user ? "bg-[#FF8200] hover:bg-[#FF8200]/90 text-white" : ""}
          >
            Start Rating
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Value Proposition */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className={`text-3xl font-bold text-center mb-12 ${user ? 'text-white' : 'text-foreground'}`}>
            Why Rate Professors?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className={`p-6 ${user ? 'bg-[#041E42]/80 border-[#B1B3B3]/20' : ''}`}>
              <h3 className={`text-xl font-semibold mb-4 ${user ? 'text-white' : 'text-foreground'}`}>
                Make Informed Decisions
              </h3>
              <p className={`${user ? 'text-white/80' : 'text-muted-foreground'}`}>
                Choose the right professors and courses based on real student experiences and feedback.
              </p>
            </Card>
            <Card className={`p-6 ${user ? 'bg-[#041E42]/80 border-[#B1B3B3]/20' : ''}`}>
              <h3 className={`text-xl font-semibold mb-4 ${user ? 'text-white' : 'text-foreground'}`}>
                Help Future Students
              </h3>
              <p className={`${user ? 'text-white/80' : 'text-muted-foreground'}`}>
                Share your experiences to help other students succeed in their academic journey.
              </p>
            </Card>
            <Card className={`p-6 ${user ? 'bg-[#041E42]/80 border-[#B1B3B3]/20' : ''}`}>
              <h3 className={`text-xl font-semibold mb-4 ${user ? 'text-white' : 'text-foreground'}`}>
                Build Transparency
              </h3>
              <p className={`${user ? 'text-white/80' : 'text-muted-foreground'}`}>
                Contribute to a more transparent and effective educational environment.
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
            Ready to Share Your Experience?
          </h3>
          <p className={`text-lg mb-6 ${user ? 'text-white' : 'text-muted-foreground'}`}>
            Join our community and help create a better academic experience for everyone
          </p>
          <Button 
            onClick={() => navigate('/professor-rating')}
            size="lg"
            className={user ? "bg-[#FF8200] hover:bg-[#FF8200]/90 text-white" : ""}
          >
            Get Started
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ProfessorRatingLanding;
