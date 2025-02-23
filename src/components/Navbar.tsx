
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
  const {
    user,
    signOut,
    error: authError
  } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const {
        success
      } = await signOut();
      if (success) {
        toast.success("Signed out successfully");
      }
    } catch (err) {
      toast.error(authError || "Failed to sign out");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <nav className={`border-b bg-[#003B5C] text-white sticky top-0 z-50 ${user ? 'utep-theme' : ''}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl md:text-2xl font-bold text-[#FF7F32]">ImStudents</Link>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-2">
                  <Button variant="outline" asChild className="text-white hover:text-[#FF7F32] border-white/20">
                    <Link to="/portfolio">My Portfolio</Link>
                  </Button>
                  <Button variant="outline" asChild className="relative text-white hover:text-[#FF7F32] border-white/20">
                    <Link to="/connections">
                      Social
                      <NotificationBadge type="social" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="text-white hover:text-[#FF7F32] border-white/20">
                    <Link to="/profile">My Profile</Link>
                  </Button>
                </div>
              ) : (
                <Button variant="outline" disabled className="text-white/60 border-white/20">
                  Portfolio
                </Button>
              )}

              {user ? (
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
                  <DropdownMenuContent className="w-56 bg-[#003B5C] text-white border-white/20" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.email}</p>
                        <p className="text-xs leading-none text-white/70">
                          {user.user_metadata?.full_name || "Student"}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/20" />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="text-white hover:text-[#FF7F32]">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="text-white hover:text-[#FF7F32]">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/20" />
                    <DropdownMenuItem 
                      className="text-red-400 cursor-pointer disabled:cursor-not-allowed hover:text-red-300" 
                      disabled={isSigningOut} 
                      onClick={handleSignOut}
                    >
                      {isSigningOut ? "Signing out..." : "Sign out"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <AuthDialog />
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
