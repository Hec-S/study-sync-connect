
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { NotificationBadge } from "@/components/ui/notification-badge";
import { User } from "lucide-react";
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
        <div className="flex items-center justify-between">
          <Link to="/" className={`text-xl md:text-2xl font-bold ${user ? 'text-[#FF8200]' : 'text-primary'}`}>
            ImStudents
          </Link>
          
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <Button variant="outline" asChild className="nav-button">
                  <Link to="/portfolio">My Portfolio</Link>
                </Button>
                <Button variant="outline" asChild className="nav-button relative">
                  <Link to="/connections">
                    Social
                    <NotificationBadge type="social" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="nav-button">
                  <Link to="/profile">My Profile</Link>
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
                  <DropdownMenuContent className="w-56 bg-[#041E42] text-white border-[#B1B3B3]/20" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.email}</p>
                        <p className="text-xs leading-none text-[#B1B3B3]">
                          {user.user_metadata?.full_name || "Student"}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[#B1B3B3]/20" />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="text-[#B1B3B3] hover:text-[#FF8200]">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="text-[#B1B3B3] hover:text-[#FF8200]">
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#B1B3B3]/20" />
                    <DropdownMenuItem 
                      className="text-red-400 cursor-pointer disabled:cursor-not-allowed hover:text-red-300" 
                      disabled={isSigningOut} 
                      onClick={handleSignOut}
                    >
                      {isSigningOut ? "Signing out..." : "Sign out"}
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
