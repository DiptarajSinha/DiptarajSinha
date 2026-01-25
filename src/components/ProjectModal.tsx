'use client';

import { Project } from '@/data/projectData';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image'; // Assuming you might want to add images later

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          // This is the main overlay
          className="absolute left-0 top-0 w-full min-h-screen z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          style={{ top: window.scrollY }} // <-- Simplified & robust positioning
          onClick={onClose} // <-- Click-outside-to-close
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            // This is the modal's content box
            className="bg-zinc-950 text-white w-full max-w-2xl p-6 rounded-xl border border-gray-700 shadow-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // <-- Prevents click inside from closing the modal
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl md:text-3xl font-bold pr-4">{project.title}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white flex-shrink-0" aria-label="Close">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <p className="text-gray-300 mb-4">{project.description}</p>

            {project.techStack && (
              <div className="mb-6">
                <h4 className="font-semibold mb-2 text-gray-200">Tech Stack:</h4>
                <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                        <span key={tech} className="bg-zinc-800 text-red-400 text-xs font-mono px-2 py-1 rounded">
                            {tech}
                        </span>
                    ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 mt-6 border-t border-gray-700 pt-6">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 bg-zinc-700 text-white text-sm rounded hover:bg-zinc-600 transition font-semibold"
                >
                  Source Code
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-500 transition font-semibold"
                >
                  Live Demo
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}