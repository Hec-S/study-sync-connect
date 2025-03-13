
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { NotificationBadge } from "@/components/ui/notification-badge";
import { User, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return; // Prevent multiple clicks
    
    setIsSigningOut(true);
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate('/');
    } catch (err) {
      toast.error("Failed to sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <nav className={`border-b sticky top-0 z-50 ${user ? 'border-white/10 bg-[#041E42]' : 'bg-background border-border'} backdrop-blur-md`}>
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-3 items-center">
          <div className="flex justify-start">
            <Link to="/" className={`text-xl md:text-2xl font-bold ${user ? 'text-[#FF8200]' : 'text-primary'}`}>
              ImStudents
            </Link>
          </div>
          
          <div className="flex items-center justify-center">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="nav-button bg-[#041E42]/80 border-[#FF8200]/30 hover:bg-[#041E42] hover:border-[#FF8200]/50 transition-all"
                  >
                    <span className="text-white font-medium">Quick Nav</span> 
                    <ChevronDown className="ml-2 h-4 w-4 text-[#FF8200]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-[#041E42] text-white border-[#FF8200]/20 shadow-lg shadow-[#FF8200]/10 p-1">
                  <DropdownMenuItem asChild className="py-2">
                    <Link to="/professor-rating" className="text-white hover:text-[#FF8200] transition-colors flex items-center">
                      <span className="mr-2 text-[#FF8200]">•</span>
                      Professor Rating
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-2">
                    <Link to="/marketplace" className="text-white hover:text-[#FF8200] transition-colors flex items-center">
                      <span className="mr-2 text-[#FF8200]">•</span>
                      WorkHub
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-2">
                    <Link to="/portfolio-feed" className="text-white hover:text-[#FF8200] transition-colors flex items-center">
                      <span className="mr-2 text-[#FF8200]">•</span>
                      Portfolio Feed
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-2">
                    <Link to="/connections" className="text-white hover:text-[#FF8200] transition-colors flex items-center">
                      <span className="mr-2 text-[#FF8200]">•</span>
                      Social
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          <div className="flex items-center justify-end">
            {user ? (
              <div className="flex items-center gap-2 justify-end">
                <Button 
                  variant="outline" 
                  asChild 
                  className="nav-button bg-[#041E42]/80 border-[#FF8200]/30 hover:bg-[#041E42] hover:border-[#FF8200]/50 transition-all hidden md:flex"
                >
                  <Link to="/portfolio">
                    <span className="text-white font-medium">My Portfolio</span>
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  asChild 
                  className="nav-button relative bg-[#041E42]/80 border-[#FF8200]/30 hover:bg-[#041E42] hover:border-[#FF8200]/50 transition-all hidden md:flex"
                >
                  <Link to="/connections">
                    <span className="text-white font-medium">Social</span>
                    <NotificationBadge type="social" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  asChild 
                  className="nav-button bg-[#041E42]/80 border-[#FF8200]/30 hover:bg-[#041E42] hover:border-[#FF8200]/50 transition-all hidden md:flex"
                >
                  <Link to="/profile">
                    <span className="text-white font-medium">My Profile</span>
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ""} />
                        <AvatarFallback>
                          {user.email?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-[#041E42] text-white border-[#FF8200]/20 shadow-lg shadow-[#FF8200]/10 p-1" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal border-b border-[#FF8200]/20 pb-2 mb-1">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-white">{user.email}</p>
                        <p className="text-xs leading-none text-[#B1B3B3]">
                          {user.user_metadata?.full_name || "Student"}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuItem asChild className="py-2">
                      <Link to="/profile" className="text-white hover:text-[#FF8200] transition-colors flex items-center">
                        <span className="mr-2 text-[#FF8200]">•</span>
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="py-2">
                      <Link to="/settings" className="text-white hover:text-[#FF8200] transition-colors flex items-center">
                        <span className="mr-2 text-[#FF8200]">•</span>
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#FF8200]/20 my-1" />
                    <DropdownMenuItem 
                      className="py-2 cursor-pointer disabled:cursor-not-allowed flex items-center" 
                      disabled={isSigningOut} 
                      onClick={handleSignOut}
                    >
                      <span className="mr-2 text-red-400">•</span>
                      <span className="text-red-400 hover:text-red-300 transition-colors">
                        {isSigningOut ? "Signing out..." : "Sign out"}
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <AuthDialog />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
