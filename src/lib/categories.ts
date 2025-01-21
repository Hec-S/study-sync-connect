export type Category = {
  id: string;
  name: string;
  description?: string;
  subcategories?: Category[];
};

export const categories: Category[] = [
  {
    id: "academic",
    name: "Academic Help",
    subcategories: [
      { id: "tutoring", name: "Tutoring" },
      { id: "essay-writing", name: "Essay Writing" },
      { id: "research", name: "Research Assistance" },
      { id: "lab-report", name: "Lab Report Writing" }
    ]
  },
  {
    id: "technology",
    name: "Technology",
    subcategories: [
      { id: "web-dev", name: "Web Development" },
      { id: "app-dev", name: "App Development" },
      { id: "debugging", name: "Software Debugging" },
      { id: "data-analysis", name: "Data Analysis" }
    ]
  },
  {
    id: "creative",
    name: "Creative Arts",
    subcategories: [
      { id: "graphic-design", name: "Graphic Design" },
      { id: "video-editing", name: "Video Editing" },
      { id: "photography", name: "Photography" },
      { id: "animation", name: "Animation" }
    ]
  },
  {
    id: "business",
    name: "Business & Marketing",
    subcategories: [
      { id: "social-media", name: "Social Media Management" },
      { id: "business-plan", name: "Business Plan Writing" },
      { id: "marketing", name: "Marketing Strategy" },
      { id: "data-entry", name: "Data Entry" }
    ]
  },
  {
    id: "event",
    name: "Event & Club Support",
    subcategories: [
      { id: "event-planning", name: "Event Planning" },
      { id: "design", name: "Flyer and Poster Design" },
      { id: "coordination", name: "Volunteer Coordination" }
    ]
  },
  {
    id: "general",
    name: "General Tasks",
    subcategories: [
      { id: "presentation", name: "Presentation Design" },
      { id: "resume", name: "Resume Building" },
      { id: "proofreading", name: "Proofreading and Editing" },
      { id: "translation", name: "Translation Services" }
    ]
  },
  {
    id: "other",
    name: "Other",
    description: "Custom project type"
  }
];

export const flattenCategories = () => {
  const flattened: Category[] = [];
  
  categories.forEach(category => {
    flattened.push({ id: category.id, name: category.name });
    category.subcategories?.forEach(sub => {
      flattened.push({ 
        id: `${category.id}-${sub.id}`, 
        name: `${category.name} - ${sub.name}` 
      });
    });
  });
  
  return flattened;
};