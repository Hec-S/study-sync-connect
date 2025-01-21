import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, User } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
          Campus Connect
        </Link>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/create-project" className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Post Project
            </Link>
          </Button>
          
          <Button variant="ghost" size="icon" asChild>
            <Link to="/search">
              <Search className="w-5 h-5" />
            </Link>
          </Button>
          
          <Button variant="ghost" size="icon" asChild>
            <Link to="/profile">
              <User className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};