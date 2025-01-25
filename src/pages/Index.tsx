import { Navbar } from "@/components/Navbar";
import { ProjectGrid } from "@/components/ProjectGrid";
import { PermissionsTester } from "@/components/PermissionsTester";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {user && <PermissionsTester />}
          <ProjectGrid />
        </div>
      </main>
    </div>
  );
};

export default Index;