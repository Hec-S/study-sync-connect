import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Sparkles, Briefcase, Medal, Code, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";

const WorkHubLanding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: Users,
      title: "Team Formation",
      description: "Find like-minded students and form teams based on complementary skills and shared interests."
    },
    {
      icon: Briefcase,
      title: "Project Discovery",
      description: "Browse through diverse projects or post your own ideas to find the perfect collaboration opportunity."
    },
    {
      icon: Medal,
      title: "Skill Showcase",
      description: "Display your expertise, share your portfolio, and demonstrate your capabilities to potential collaborators."
    },
    {
      icon: Code,
      title: "Real-world Experience",
      description: "Work on practical projects that enhance your skills and prepare you for your future career."
    }
  ];

  return (
    <div className={`min-h-screen ${user ? 'bg-[#041E42]' : 'bg-background'}`}>
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className={`w-12 h-12 ${user ? 'text-[#FF8200]' : 'text-primary'}`} />
            <h1 className={`text-4xl md:text-5xl font-bold ${user ? 'text-[#FF8200]' : 'text-primary'}`}>
              Work Hub
            </h1>
          </div>
          <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${user ? 'text-white' : 'text-muted-foreground'}`}>
            Connect with fellow students, collaborate on exciting projects, and build a portfolio that showcases your talents.
          </p>
          <Button 
            onClick={() => navigate('/marketplace')}
            size="lg"
            className={user ? "bg-[#FF8200] hover:bg-[#FF8200]/90 text-white" : ""}
          >
            Explore Projects
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Value Proposition */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className={`text-3xl font-bold text-center mb-12 ${user ? 'text-white' : 'text-foreground'}`}>
            Why Join Work Hub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className={`p-6 ${user ? 'bg-[#041E42]/80 border-[#B1B3B3]/20' : ''}`}>
              <h3 className={`text-xl font-semibold mb-4 ${user ? 'text-white' : 'text-foreground'}`}>
                Build Your Portfolio
              </h3>
              <p className={`${user ? 'text-white/80' : 'text-muted-foreground'}`}>
                Create a compelling portfolio of real projects that demonstrates your abilities to future employers.
              </p>
            </Card>
            <Card className={`p-6 ${user ? 'bg-[#041E42]/80 border-[#B1B3B3]/20' : ''}`}>
              <h3 className={`text-xl font-semibold mb-4 ${user ? 'text-white' : 'text-foreground'}`}>
                Gain Experience
              </h3>
              <p className={`${user ? 'text-white/80' : 'text-muted-foreground'}`}>
                Work on practical projects that give you hands-on experience in your field of study.
              </p>
            </Card>
            <Card className={`p-6 ${user ? 'bg-[#041E42]/80 border-[#B1B3B3]/20' : ''}`}>
              <h3 className={`text-xl font-semibold mb-4 ${user ? 'text-white' : 'text-foreground'}`}>
                Network with Peers
              </h3>
              <p className={`${user ? 'text-white/80' : 'text-muted-foreground'}`}>
                Connect with talented students and build relationships that can last throughout your career.
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
            Ready to Start Collaborating?
          </h3>
          <p className={`text-lg mb-6 ${user ? 'text-white' : 'text-muted-foreground'}`}>
            Join our community of student innovators and start building your future today
          </p>
          <Button 
            onClick={() => navigate('/marketplace')}
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

export default WorkHubLanding;
