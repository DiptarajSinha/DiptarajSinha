// components/MainLayout.tsx
'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import ContactModal from './ContactModal';
import ProjectModal from './ProjectModal';
import { Project } from '@/data/projectData';
import { FaChevronDown } from 'react-icons/fa';

export default function MainLayout({
  children,
  role,
  roles,
  avatar,
  onRoleSelect,
}: {
  children: ReactNode;
  role: string;
  roles: string[];
  avatar: string;
  onRoleSelect: (role: string) => void;
}) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showReachOut, setShowReachOut] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    document.body.style.overflow = showContact || showReachOut || selectedProject ? 'hidden' : 'auto';
  }, [showContact, showReachOut, selectedProject]);

  return (
    <main className="bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-zinc-800/50">
        <div className="px-6 md:px-16 py-6 flex items-center justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {role === 'Stalker'
              ? '👀 Caught you stalking...'
              : role === 'Adventurer'
              ? '🌍 Welcome, Adventurer'
              : 'Hi, I’m Diptaraj'}
          </h1>

          {/* Avatar & Dropdown */}
          <div className="relative flex items-center gap-3">
            <div
              className="relative"
              onMouseEnter={() => !isMobile && setDropdownOpen(true)}
              onMouseLeave={() => !isMobile && setDropdownOpen(false)}
            >
              <button
                onClick={() => isMobile && setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <Image src={avatar} alt="Avatar" width={40} height={40} className="rounded-full" />
                <FaChevronDown />
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-44 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg z-50"
                  >
                    {roles.map((r) => (
                      <button
                        key={r}
                        onClick={() => onRoleSelect(r)}
                        className="flex items-center gap-2 px-4 py-2 w-full hover:bg-zinc-800 text-white"
                      >
                        <Image src={`/avatars/${r.toLowerCase()}.jpg`} alt={r} width={24} height={24} className="rounded-full" />
                        {r}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Children Sections */}
      <div className="px-6 md:px-16 py-8">{children}</div>

      {/* Modals */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />
    </main>
  );
}
