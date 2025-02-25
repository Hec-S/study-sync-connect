import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Folder, Users, MessageSquare, Share2, ChevronRight } from "lucide-react";

const PortfolioLanding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: Folder,
      title: "Project Showcase",
      description: "Share your academic and extracurricular projects in a professional portfolio format. Highlight your skills and achievements to fellow students."
    },
    {
      icon: Share2,
      title: "Social Feed",
      description: "Browse through a dynamic feed of student projects. Discover interesting work, follow projects you like, and stay updated on the latest student innovations."
    },
    {
      icon: MessageSquare,
      title: "Engage in Discussions",
      description: "Participate in meaningful discussions about projects. Share insights, give feedback, and learn from other students' experiences."
    },
    {
      icon: Users,
      title: "Connect with Peers",
      description: "Find and connect with students who share your interests. Build relationships with others working on similar projects or in related fields."
    }
  ];

  return (
    <div className={`min-h-screen ${user ? 'bg-[#041E42]' : 'bg-background'}`}>
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Folder className={`w-12 h-12 ${user ? 'text-[#FF8200]' : 'text-primary'}`} />
            <h1 className={`text-4xl md:text-5xl font-bold ${user ? 'text-[#FF8200]' : 'text-primary'}`}>
              Portfolio
            </h1>
          </div>
          <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${user ? 'text-white' : 'text-muted-foreground'}`}>
            Showcase your projects, discover amazing work from fellow students, and build meaningful connections through shared interests.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/portfolio')}
              size="lg"
              className={user ? "bg-[#FF8200] hover:bg-[#FF8200]/90 text-white" : ""}
            >
              My Portfolio
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              onClick={() => navigate('/portfolio-feed')}
              size="lg"
              variant={user ? "outline" : "secondary"}
              className={user ? "border-[#FF8200] text-[#FF8200] hover:bg-[#FF8200] hover:text-white" : ""}
            >
              View Feed
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
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
            Ready to Get Started?
          </h3>
          <p className={`text-lg mb-6 ${user ? 'text-white' : 'text-muted-foreground'}`}>
            Join our community and start showcasing your work to fellow students
          </p>
          <Button 
            onClick={() => navigate('/portfolio')}
            size="lg"
            className={user ? "bg-[#FF8200] hover:bg-[#FF8200]/90 text-white" : ""}
          >
            Create Your Portfolio
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default PortfolioLanding;
