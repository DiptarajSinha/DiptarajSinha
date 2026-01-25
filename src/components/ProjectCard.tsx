// components/ProjectCard.tsx
import { Project } from '@/data/projectData';

export default function ProjectCard({
  project,
  onView,
}: {
  project: Project;
  onView: () => void;
}) {
  return (
    <div className="flex flex-col justify-between h-[220px]">
      <div>
        <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
        <p className="text-sm text-gray-400">{project.description}</p>
      </div>
      <button
        onClick={onView}
        className="mt-4 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-500 transition"
      >
        View Project
      </button>
    </div>
  );
}
