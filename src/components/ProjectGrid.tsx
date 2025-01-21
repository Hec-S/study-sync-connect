import { ProjectCard } from "./ProjectCard";

const SAMPLE_PROJECTS = [
  {
    title: "Mobile App UI Design",
    description: "Looking for a UI/UX designer to help create mockups for a new campus events app.",
    category: "Design",
    deadline: "Mar 30, 2024",
    skills: ["Figma", "UI Design", "Mobile Design"],
  },
  {
    title: "Database Project Help",
    description: "Need assistance with designing and implementing a PostgreSQL database for a web application.",
    category: "Development",
    deadline: "Apr 15, 2024",
    skills: ["SQL", "Database Design", "PostgreSQL"],
  },
  {
    title: "Research Paper Review",
    description: "Seeking peer review for my research paper on renewable energy technologies.",
    category: "Research",
    deadline: "Mar 25, 2024",
    skills: ["Academic Writing", "Research", "Energy"],
  },
  {
    title: "Marketing Campaign",
    description: "Looking for creative minds to help plan a marketing campaign for our student organization.",
    category: "Marketing",
    deadline: "Apr 5, 2024",
    skills: ["Social Media", "Content Creation", "Strategy"],
  },
];

export const ProjectGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {SAMPLE_PROJECTS.map((project, index) => (
        <ProjectCard key={index} {...project} />
      ))}
    </div>
  );
};