
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, Users, Briefcase, BookOpen, Search, MessagesSquare } from "lucide-react";
import { toast } from "sonner";

export const UtepAssistantPage = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState("");

  const handleAssistantQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error("Please enter a question or request");
      return;
    }
    // TODO: Implement AI assistant query handling
    console.log("Assistant query:", query);
    toast.success("Your request is being processed");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Brain className="w-16 h-16 text-primary animate-pulse" />
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800">UTEP Assistant</h1>
              </div>
              <p className="text-xl text-gray-600">Your personal AI guide for academic success</p>
            </div>

            {/* AI Assistant Input */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <form onSubmit={handleAssistantQuery} className="flex gap-4">
                  <Input
                    placeholder="Ask me anything about UTEP, courses, career opportunities..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-12 text-lg"
                  />
                  <Button type="submit" size="lg" className="min-w-[120px]">
                    <MessagesSquare className="mr-2 h-5 w-5" />
                    Ask
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Main Content Tabs */}
            <Tabs defaultValue="academic" className="space-y-6">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 gap-4 bg-transparent h-auto p-0">
                <TabsTrigger 
                  value="academic"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Academic Support
                </TabsTrigger>
                <TabsTrigger 
                  value="social"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Study Groups
                </TabsTrigger>
                <TabsTrigger 
                  value="career"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
                >
                  <Briefcase className="mr-2 h-5 w-5" />
                  Career Opportunities
                </TabsTrigger>
              </TabsList>

              <TabsContent value="academic" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Academic Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <Button variant="outline" className="h-auto p-4 justify-start">
                      <div className="flex flex-col items-start text-left">
                        <span className="font-semibold">Course Recommendations</span>
                        <span className="text-sm text-muted-foreground">Get personalized course suggestions based on your interests</span>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 justify-start">
                      <div className="flex flex-col items-start text-left">
                        <span className="font-semibold">Study Materials</span>
                        <span className="text-sm text-muted-foreground">Access study guides and resources for your courses</span>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 justify-start">
                      <div className="flex flex-col items-start text-left">
                        <span className="font-semibold">Academic Calendar</span>
                        <span className="text-sm text-muted-foreground">Important dates and deadlines</span>
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="social" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Study Groups</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <Button variant="outline" className="h-auto p-4 justify-start">
                      <div className="flex flex-col items-start text-left">
                        <span className="font-semibold">Find Study Partners</span>
                        <span className="text-sm text-muted-foreground">Connect with students in your courses</span>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 justify-start">
                      <div className="flex flex-col items-start text-left">
                        <span className="font-semibold">Create Study Group</span>
                        <span className="text-sm text-muted-foreground">Start a new study group for your course</span>
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="career" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Career Development</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <Button variant="outline" className="h-auto p-4 justify-start">
                      <div className="flex flex-col items-start text-left">
                        <span className="font-semibold">Internship Opportunities</span>
                        <span className="text-sm text-muted-foreground">Discover internships matching your skills</span>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 justify-start">
                      <div className="flex flex-col items-start text-left">
                        <span className="font-semibold">Career Events</span>
                        <span className="text-sm text-muted-foreground">Upcoming career fairs and workshops</span>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 justify-start">
                      <div className="flex flex-col items-start text-left">
                        <span className="font-semibold">Resume Review</span>
                        <span className="text-sm text-muted-foreground">Get AI-powered feedback on your resume</span>
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};
