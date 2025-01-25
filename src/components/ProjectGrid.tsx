import { ProjectCard } from "./ProjectCard";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface Project {
  id: string; // Add this
  title: string;
  description: string;
  category: string;
  deadline: string;
  skills: string[];
}

const SAMPLE_PROJECTS: Project[] = [
  {
    id: "1", // Add ids to all sample projects
    title: "Mobile App UI Design",
    description: "Looking for a UI/UX designer to help create mockups for a new campus events app. Need someone with experience in mobile design patterns and user research.",
    category: "Design",
    deadline: "Mar 30, 2024",
    skills: ["Figma", "UI Design", "Mobile Design"],
  },
  {
    id: "2",
    title: "Database Project Help",
    description: "Need assistance with designing and implementing a PostgreSQL database for a web application. Looking for someone with strong SQL knowledge.",
    category: "Development",
    deadline: "Apr 15, 2024",
    skills: ["SQL", "Database Design", "PostgreSQL"],
  },
  {
    id: "3",
    title: "Research Paper Review",
    description: "Seeking peer review for my research paper on renewable energy technologies. Background in environmental science or engineering preferred.",
    category: "Research",
    deadline: "Mar 25, 2024",
    skills: ["Academic Writing", "Research", "Energy"],
  },
  {
    id: "4",
    title: "Marketing Campaign",
    description: "Looking for creative minds to help plan a marketing campaign for our student organization. Experience with social media marketing is a plus.",
    category: "Marketing",
    deadline: "Apr 5, 2024",
    skills: ["Social Media", "Content Creation", "Strategy"],
  },
  {
    id: "5",
    title: "Machine Learning Project",
    description: "Seeking collaboration on a machine learning project focused on natural language processing. Python and TensorFlow experience required.",
    category: "Development",
    deadline: "Apr 20, 2024",
    skills: ["Python", "Machine Learning", "NLP"],
  },
  {
    id: "6",
    title: "Video Production",
    description: "Need help creating promotional videos for our student club. Looking for someone with video editing and motion graphics skills.",
    category: "Design",
    deadline: "Apr 10, 2024",
    skills: ["Video Editing", "Motion Graphics", "Adobe Premiere"],
  },
];

const ProjectGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 opacity-75 transition-opacity duration-200">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="space-y-4 p-6 border rounded-lg bg-white/50">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-20 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    ))}
  </div>
);

export const ProjectGrid = () => {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => Promise.resolve(SAMPLE_PROJECTS),
    initialData: SAMPLE_PROJECTS,
  });

  if (isLoading) {
    return <ProjectGridSkeleton />;
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Projects Found</h3>
        <p className="text-gray-600">Be the first to post a project!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 opacity-100 transition-opacity duration-200">
      {projects.map((project) => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  );
};