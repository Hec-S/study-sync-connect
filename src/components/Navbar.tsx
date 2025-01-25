import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Bell, Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { AuthDialog } from "./auth/AuthDialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handlePostProject = () => {
    if (!user) {
      toast.error("Please sign in to post a project");
      localStorage.setItem("redirectPath", "/create-project");
      setShowAuthDialog(true);
      return;
    }
    navigate("/create-project");
  };

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl md:text-2xl font-bold text-primary">
            Campus Connect
          </Link>
          
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="outline" asChild className="hidden md:flex">
              <span onClick={handlePostProject} className="flex items-center gap-2 cursor-pointer">
                <PlusCircle className="w-4 h-4" />
                Post Project
              </span>
            </Button>
            
            <div className={`fixed inset-0 bg-white/95 md:bg-transparent md:static md:flex items-center gap-2 transition-all duration-300 ${isMenuOpen ? 'flex flex-col pt-20' : 'hidden'}`}>
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link to="/notifications">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </Link>
              </Button>
              
              <Button variant="ghost" size="icon" asChild>
                <Link to="/search">
                  <Search className="w-5 h-5" />
                </Link>
              </Button>

              {user ? (
                <>
                  <Button variant="outline" asChild>
                    <Link to="/portfolio">Portfolio</Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleSignOut}>
                    <LogOut className="w-5 h-5" />
                  </Button>
                </>
              ) : (
                <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
              )}

              <Button variant="outline" asChild className="md:hidden w-full mt-4">
                <span onClick={handlePostProject} className="flex items-center justify-center gap-2 cursor-pointer">
                  <PlusCircle className="w-4 h-4" />
                  Post Project
                </span>
              </Button>
            </div>

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};