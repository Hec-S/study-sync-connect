import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Bell } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl md:text-2xl font-bold text-primary">
            Campus Connect
          </Link>
          
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="outline" asChild>
              <Link to="/create-project" className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                Post Project
              </Link>
            </Button>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/search">
                  <Search className="w-5 h-5" />
                </Link>
              </Button>

              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>

              <Button variant="outline" asChild>
                <Link to="/portfolio">Portfolio</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};