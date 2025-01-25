import { ProjectGrid } from "@/components/ProjectGrid";
import { CategorySelect } from "@/components/CategorySelect";
import { useState } from "react";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Discover Projects</h1>
        <CategorySelect
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        />
      </div>
      <ProjectGrid />
    </div>
  );
};

export default Index;