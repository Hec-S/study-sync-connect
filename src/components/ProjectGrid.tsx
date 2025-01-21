import { ProjectCard } from "./ProjectCard";
import { useQuery } from "@tanstack/react-query";

const SAMPLE_PROJECTS = [
  {
    title: "Mobile App UI Design",
    description: "Looking for a UI/UX designer to help create mockups for a new campus events app. Need someone with experience in mobile design patterns and user research.",
    category: "Design",
    deadline: "Mar 30, 2024",
    skills: ["Figma", "UI Design", "Mobile Design"],
  },
  {
    title: "Database Project Help",
    description: "Need assistance with designing and implementing a PostgreSQL database for a web application. Looking for someone with strong SQL knowledge.",
    category: "Development",
    deadline: "Apr 15, 2024",
    skills: ["SQL", "Database Design", "PostgreSQL"],
  },
  {
    title: "Research Paper Review",
    description: "Seeking peer review for my research paper on renewable energy technologies. Background in environmental science or engineering preferred.",
    category: "Research",
    deadline: "Mar 25, 2024",
    skills: ["Academic Writing", "Research", "Energy"],
  },
  {
    title: "Marketing Campaign",
    description: "Looking for creative minds to help plan a marketing campaign for our student organization. Experience with social media marketing is a plus.",
    category: "Marketing",
    deadline: "Apr 5, 2024",
    skills: ["Social Media", "Content Creation", "Strategy"],
  },
  {
    title: "Machine Learning Project",
    description: "Seeking collaboration on a machine learning project focused on natural language processing. Python and TensorFlow experience required.",
    category: "Development",
    deadline: "Apr 20, 2024",
    skills: ["Python", "Machine Learning", "NLP"],
  },
  {
    title: "Video Production",
    description: "Need help creating promotional videos for our student club. Looking for someone with video editing and motion graphics skills.",
    category: "Design",
    deadline: "Apr 10, 2024",
    skills: ["Video Editing", "Motion Graphics", "Adobe Premiere"],
  },
];

export const ProjectGrid = () => {
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => new Promise((resolve) => {
      // Simulate API call with a small delay
      setTimeout(() => resolve(SAMPLE_PROJECTS), 300);
    }),
    initialData: SAMPLE_PROJECTS, // Show initial data immediately
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {projects.map((project, index) => (
        <ProjectCard key={index} {...project} />
      ))}
    </div>
  );
};