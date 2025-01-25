import { Navbar } from "@/components/Navbar";
import { PortfolioGrid } from "./PortfolioGrid";

export const PortfolioPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Portfolio</h1>
          <PortfolioGrid />
        </div>
      </main>
    </div>
  );
};