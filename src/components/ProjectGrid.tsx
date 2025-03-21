import { ProjectCard } from "./ProjectCard";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface Project {
  title: string;
  description: string;
  category: string;
  deadline: string;
  skills: string[];
}

const SAMPLE_PROJECTS: Project[] = [
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

const ProjectGridSkeleton = () => (
  <div className="flex flex-wrap gap-6 justify-center opacity-75 transition-opacity duration-200">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="w-[300px] h-[400px] p-6 border rounded-lg bg-white/50 flex flex-col">
        <div className="space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-20 w-full" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
        <div className="mt-auto pt-4 border-t">
          <Skeleton className="h-8 w-full" />
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
    <div className="flex flex-wrap gap-6 justify-center opacity-100 transition-opacity duration-200">
      {projects.map((project, index) => (
        <ProjectCard key={index} {...project} />
      ))}
    </div>
  );
};
