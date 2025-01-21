import React from "react";
import { Navbar } from "@/components/Navbar";
import { PortfolioPage } from "@/components/portfolio/PortfolioPage";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PortfolioPage />
    </div>
  );
};

export default Index;