'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import { FaChevronLeft, FaChevronRight, FaChevronDown } from 'react-icons/fa';

// Components
import NetflixIntro from "@/components/NetflixIntro";
import TypewriterIntro from '@/components/TypewriterIntro';
import AnimatedSection from '@/components/AnimatedSection';
import AnimatedCard from '@/components/AnimatedCard';
import ProjectModal from '@/components/ProjectModal';
import ContactModal from '@/components/ContactModal';
import TypewriterRecruiter from '@/components/TypewriterRecruiter';
import TypewriterAdventurer from '@/components/TypewriterAdventurer';
import MobileWarning from '@/components/MobileWarning';
import TypewriterStalker from '@/components/TypewriterStalker';
import TypingTerminal from '@/components/TypingTerminal';
import GameModal from '@/components/GameModal';
import StalkerModal from '@/components/StalkerModal';
import AdventurerModal from '@/components/AdventurerModal';

// Local Sub-Components
import { 
  SkillCard, 
  AdventurerCarousel, 
  StalkerCarousel, 
  ProfileSelector 
} from '@/components/HomeSubComponents';

// Data
import { recruiterProjects, adventurerProjects, Project } from '@/data/projectData';
import { adventurerSectionCards, AdventurerItem } from '@/data/adventurerData';
import { stalkerSectionCards, StalkerItem } from '@/data/stalkerData';
import { adventurerGames, stalkerGames, GameItem } from '@/data/gamesData';

// Static Data
import { 
  skillsData, 
  certificationsData, 
  topPicksByRole, 
  topPickBackgrounds 
} from '@/data/homeStaticData';

// --- MAIN PAGE COMPONENT ---

export default function HomePage() {
  const projectSectionRef = useRef<HTMLDivElement>(null);
  const [role, setRole] = useState<string | null>(null);
  
  // --- STATE UPDATES ---
  // 1. Default showIntro to FALSE so it doesn't flash by mistake
  const [showIntro, setShowIntro] = useState(false);
  // 2. Add a loading state to cover the millisecond we check sessionStorage
  const [isLoading, setIsLoading] = useState(true);
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const projectScrollRef = useRef<HTMLDivElement>(null);
  const skillScrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showContact, setShowContact] = useState(false);
  const [showReachOut, setShowReachOut] = useState(false);
  const [selectedAdventurerItem, setSelectedAdventurerItem] = useState<AdventurerItem | null>(null);
  const [selectedStalkerItem, setSelectedStalkerItem] = useState<StalkerItem | null>(null);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [showTypingAnimation, setShowTypingAnimation] = useState(false);
  
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  
  const getTime = () => {
    const now = new Date();
    const hh = now.getHours().toString().padStart(2, '0');
    const mm = now.getMinutes().toString().padStart(2, '0');
    const ss = now.getSeconds().toString().padStart(2, '0');
    return `[${hh}:${mm}:${ss}]`;
  };

  // --- LOGIC FIX: PREVENT FLASH ---
  useEffect(() => {
    // Check session instantly
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    const storedRole = localStorage.getItem('selectedRole');
    
    if (!hasSeenIntro) {
      // Only now do we allow the intro to show
      setShowIntro(true);
    } else if (storedRole) {
      // If intro seen, immediately load the role
      setRole(storedRole);
    }

    // Stalker Logic (Keep existing)
    if (storedRole === 'Stalker') {
      const hasVisitedStalker = localStorage.getItem('stalker-visited');
      if (!hasVisitedStalker) {
        setShowTypingAnimation(true);
        localStorage.setItem('stalker-visited', 'true');
      } else {
        setIsFirstVisit(false);
      }
    }

    // Reveal the app (removes the black loading screen)
    setIsLoading(false);
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('hasSeenIntro', 'true'); // Mark session as visited
  };

  const handleRoleSelect = (selected: string) => {
    localStorage.setItem('selectedRole', selected);
    sessionStorage.setItem('hasSeenIntro', 'true'); // Ensure intro doesn't play on reload
    router.push(`/loading?role=${selected}`);
  };

  const handleRandomRole = () => {
    const allRoles = ['Recruiter', 'Adventurer', 'Stalker'];
    const random = allRoles[Math.floor(Math.random() * allRoles.length)];
    handleRoleSelect(random);
  };

  const handleTypingComplete = () => {
    setShowTypingAnimation(false);
    setIsFirstVisit(false);
  };

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    
    if (showContact || showReachOut || selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showContact, showReachOut, selectedProject, selectedAdventurerItem, selectedStalkerItem]);


  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const [stalkerError, setStalkerError] = useState<string | null>(null);

  const triggerStalkerError = (msg: string) => {
    setStalkerError(msg);
    setTimeout(() => setStalkerError(null), 3000); // Disappears after 3s
  };

  const getAvatar = (role: string | null) => {
    switch (role) {
      case 'Recruiter':
        return '/avatars/recruiter.jpg';
      case 'Adventurer':
        return '/avatars/adventurer.jpg';
      case 'Stalker':
        return '/avatars/stalker.jpg';
      default:
        return '/avatars/default.jpg';
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const scrollProject = (direction: 'left' | 'right') => {
    if (projectScrollRef.current) {
      const amount = direction === 'left' ? -300 : 300;
      projectScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const scrollSkills = (direction: 'left' | 'right') => {
    if (skillScrollRef.current) {
      const amount = direction === 'left' ? -300 : 300;
      skillScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const buttonBase = 'px-5 py-2 rounded shadow transition-transform hover:scale-105 duration-200';
  const roles = ['Recruiter', 'Adventurer', 'Stalker'].filter(r => r !== role);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const handleScrollToSection = (sectionId: string) => {
      const section = document.getElementById(sectionId);
      if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
  };
  
  const Sidebar = () => {
    const menuConfig = {
      Recruiter: ['Home', 'Experience', 'Skills', 'Projects', 'Education', 'Certifications', 'Hire Me'],
      Adventurer: ['Home', ...topPicksByRole.Adventurer],
      Stalker: ['Home', ...topPicksByRole.Stalker],
    };

    const items = role && role in menuConfig ? menuConfig[role as keyof typeof menuConfig] : [];
    
    return (
        <motion.aside
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          onMouseLeave={() => {
            if (!isMobile) setMenuOpen(false);
          }}
          className="absolute top-full right-0 mt-2 bg-zinc-950 text-white border border-zinc-800 rounded-lg w-56 p-4 z-[60] shadow-lg"
        >
          <div className="mb-2 text-sm text-gray-400">Navigate:</div>
          <ul className="space-y-3 text-base">
            {items.map((item: string) => {
                const itemSlug = item.toLowerCase().replace(/\s+/g, '-');
                // Special case for 'Projects' in Adventurer view to match existing ID
                const sectionId = role === 'Adventurer' && item === 'Projects' ? 'projects-adventurer' : itemSlug;
                
                return (
                    <li key={item}>
                        <a 
                            href={`#${sectionId}`} 
                            onClick={(e) => { e.preventDefault(); handleScrollToSection(sectionId); setMenuOpen(false); }} 
                            className="hover:text-red-500 transition-colors"
                        >
                            {item}
                        </a>
                    </li>
                );
            })}
          </ul>
        </motion.aside>
    );
  };

  const renderTopPicks = (role: string) => (
    <div className="space-y-4">
      <h2 className={`text-2xl font-semibold mb-4 text-left flex gap-2 ${
      (role === 'Recruiter' || role === 'Adventurer') 
        ? 'flex-col items-start sm:flex-row sm:items-baseline' /* Stacked for Recruiter & Adventurer */
        : 'flex-row items-baseline flex-wrap' /* Normal wrapping for Stalker */
    }`}>
      <span>Today's Top Picks for</span>
      {role === 'Recruiter' ? <TypewriterRecruiter /> :
      role === 'Adventurer' ? <TypewriterAdventurer /> :
      <TypewriterStalker />
      }
    </h2>
      <div className="relative w-full group">
        <button
          onClick={() => scroll('left')}
          className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 z-50 bg-zinc-700 hover:bg-zinc-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <FaChevronLeft />
        </button>
        <div
          ref={scrollRef}
          className="relative z-0 flex space-x-6 overflow-x-scroll no-scrollbar px-4 md:px-12 py-4"
        >
          {topPicksByRole[role]?.map((item, i) => {
          const bg = topPickBackgrounds[role]?.[i % topPickBackgrounds[role].length];
          const itemSlug = item.toLowerCase().replace(/\s+/g, '-').replace(/😈-/, '').replace(/"/g, '');
          const sectionId = role === 'Stalker' && item === 'Classified' ? 'classified' :
                            role === 'Stalker' && item === 'Surveillance Network' ? 'digital-surveillance-network' :
                            role === 'Stalker' && item === 'Follow me' ? 'follow-me' :
                            role === 'Adventurer' && item === 'Projects' ? 'projects-adventurer' : 
                            itemSlug;
          return (
              <div key={item} onClick={() => sectionId === 'contact-me' ? setShowContact(true) : handleScrollToSection(sectionId)} className="cursor-pointer">
                  <motion.div
                      whileHover={{ scale: 1.25, zIndex: 40 }}
                      className="min-w-[200px] h-[120px] rounded-lg overflow-hidden relative border-4 border-transparent hover:border-white hover:drop-shadow-[0_0_25px_#ffffffaa] transition-transform duration-300"
                      style={{
                      backgroundImage: `url(${bg})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      }}
                  >
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-2 text-center">
                        <span className="text-white text-lg font-semibold">{item}</span>
                      </div>
                  </motion.div>
              </div>
          );
      })}
        </div>
        <button
          onClick={() => scroll('right')}
          className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 z-50 bg-zinc-700 hover:bg-zinc-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );

  const renderProjects = (projects: Project[]) => (
    <div ref={projectSectionRef} className="relative group">
      <button
        onClick={() => scrollProject('left')}
        className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 z-50 bg-zinc-700 hover:bg-zinc-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <FaChevronLeft />
      </button>

      <div
        ref={projectScrollRef}
        className="relative z-0 flex space-x-6 overflow-x-scroll no-scrollbar px-4 md:px-12 py-4"
      >
        {projects.map((project, i) => (
          <AnimatedCard key={project.title} delay={i * 0.1}>
            <motion.div
              whileHover={{ scale: 1.1, zIndex: 55 }}
              className="relative min-w-[280px] md:min-w-[320px] h-[220px] rounded-xl p-5 border-4 border-transparent hover:border-white hover:drop-shadow-[0_0_25px_#ffffffaa] transition-transform duration-300 flex flex-col justify-between overflow-hidden"
              style={{
                backgroundImage: `url(${project.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-black/70 z-0"></div>
              <div className="relative z-10 flex flex-col justify-between h-full">
                  <div>
                      <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                      <p className="text-sm text-gray-300 line-clamp-3">{project.description}</p>
                  </div>
                  <button
                      onClick={() => handleProjectClick(project)}
                      className="mt-4 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-500 transition self-start"
                  >
                      View Project
                  </button>
              </div>
            </motion.div>
          </AnimatedCard>
        ))}
      </div>

      <button
        onClick={() => scrollProject('right')}
        className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 z-50 bg-zinc-700 hover:bg-zinc-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <FaChevronRight />
      </button>
    </div>
  );

  // --- RENDERING CONDITIONS ---

  // 1. Loading Screen (Holds the screen black while checking session)
  if (isLoading) {
    return <div className="bg-black min-h-screen" />; 
  }

  // 2. Intro Screen
  if (showIntro) {
    return (
        <div className="fixed inset-0 z-[1000] bg-black">
            <NetflixIntro onComplete={handleIntroComplete} />
            <button 
                onClick={handleIntroComplete} 
                className="absolute bottom-10 right-10 text-white text-xs opacity-50 hover:opacity-100 border border-white px-3 py-1 rounded"
            >
                SKIP INTRO
            </button>
        </div>
    );
  }

  // 3. Profile Selector (When no role is selected)
  if (!role) {
    return (
      <ProfileSelector onSelect={handleRoleSelect} />
    );
  }

  // 4. Stalker Animation (First visit only)
  if (role === 'Stalker' && showTypingAnimation) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white px-6 md:px-16 py-12">
        <TypingTerminal onComplete={handleTypingComplete} />
      </main>
    );
  }

  const getRoleFont = () => {
    switch (role) {
      case 'Recruiter': return 'font-recruiter';
      case 'Adventurer': return 'font-adventurer tracking-wide';
      case 'Stalker': return 'font-stalker tracking-tight';
      default: return 'font-sans';
    }
  };

  // Update the 'item: any' to 'item: AdventurerItem'
  const openAdventurerItem = (item: AdventurerItem) => {
  setSelectedAdventurerItem(item);
};

  return (
    <main className={`bg-black text-white ${getRoleFont()}`} id="home">
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-zinc-800/50">
        <div className="px-6 md:px-16 py-4 md:py-6 space-y-6">
          
          {/* MAIN HEADER ROW */}
          <div className="flex flex-row items-center justify-between gap-2 w-full">
            
            {/* LEFT: Name & Effect */}
            {/* FIXED: Added 'flex-nowrap' to force single line, removed 'flex-wrap' */}
            <div className="flex flex-row flex-nowrap items-baseline gap-x-1 min-w-0 overflow-hidden">
              {/* FIXED: Reduced mobile text size to 'text-base' (16px) to save space */}
              <h1 className="text-base sm:text-4xl md:text-5xl font-extrabold tracking-tight whitespace-nowrap shrink-0">
                {role === 'Stalker' ? '👀 Caught you stalking...' :
                 role === 'Adventurer' ? "I'm Diptaraj —" :
                 'Hi, I’m Diptaraj Sinha'}
              </h1>
              
              {role === 'Adventurer' && (
                <div className="flex items-center shrink-0">
                  {/* FIXED: Reduced scale to 0.60 so 'DEVELOPER' fits on small screens */}
                  <TypewriterIntro className="scale-60 origin-left sm:scale-100" /> 
                </div>
              )}
            </div>

            {/* RIGHT: Menu & Avatar */}
            <div className="relative flex items-center gap-3 shrink-0 ml-auto">
              <button
                onMouseEnter={() => { if (!isMobile) setMenuOpen(true); }}
                onClick={() => { if (isMobile) setMenuOpen(!menuOpen); }}
                className="text-xs sm:text-sm font-semibold text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
              >
                Menu
              </button>
              <AnimatePresence>{menuOpen && <Sidebar />}</AnimatePresence>
              <div
                className="relative"
                onMouseEnter={() => { if (!isMobile) setDropdownOpen(true); }}
                onMouseLeave={() => { if (!isMobile) setDropdownOpen(false); }}
              >
                <button
                  onClick={() => { if (isMobile) setDropdownOpen(!dropdownOpen); }}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <Image src={getAvatar(role)} alt="Avatar" width={32} height={32} className="rounded-full sm:w-[40px] sm:h-[40px]"/>
                  <FaChevronDown className="text-xs sm:text-base" />
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
                        <button key={r} onClick={() => handleRoleSelect(r)} className="flex items-center gap-2 px-4 py-2 w-full hover:bg-zinc-800 text-white">
                          <Image src={getAvatar(r)} alt={r} width={24} height={24} className="rounded-full"/>
                          {r}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* DESCRIPTIONS ROW */}
          {role === 'Recruiter' && (
            <div>
              <p className="text-lg md:text-xl text-gray-300 mb-4">
                CSE Final year student with passion for Gen AI and high-performance Frontend Engineering.
              </p>
              <a href="/CV - Diptaraj Sinha.pdf" download className={`${buttonBase} bg-red-600 text-white hover:bg-red-500`}>
                Download CV
              </a>
            </div>
          )}
          {role === 'Adventurer' && (
            <div>
              <p className="text-sm md:text-lg text-gray-300 mb-4">
                You’ve found the path less taken. This is where I experiment with new ideas and showcase creative coding.
              </p>
            </div>
          )}
          {role === 'Stalker' && (
            <div>
              <p className="text-lg italic text-gray-400">I see you. Always watching.</p>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 md:px-16 space-y-12 relative z-0">
        
        <section className="space-y-8 py-8">
            {role === 'Recruiter' && (
                <>
                {renderTopPicks(role)}
                
                <AnimatedSection>
                    <div className="scroll-mt-28" id="experience">
                        <h2 className="text-3xl font-bold mb-6 text-left">Experience</h2>
                        <div className="space-y-8">
                            <motion.div whileHover={{ scale: 1.02 }} className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl shadow-lg transition-transform duration-300">
                              <h3 className="text-xl font-bold text-white mb-2">Generative AI Developer Intern @ AI WALLAH</h3>
                              <p className="text-sm text-zinc-400 mb-1">June 2025 - July 2025</p>
                              <p className="text-gray-400 text-sm mb-3">
                                  - Working on projects involving generative AI models and LLM-based applications.
                              </p>
                              <p className="text-gray-400 text-sm mb-3">
                                  - Gaining practical experience in deploying AI solutions for real-world use cases.
                              </p>
                              <a 
                                  href="https://drive.google.com/file/d/1v4QSluSUOjgKwcW5kqVOI_1d_l4dqzTg/view?usp=sharing" 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200"
                              >
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  View Certificate
                              </a>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl shadow-lg transition-transform duration-300">
                                <h3 className="text-xl font-bold text-white mb-2">Cybersecurity (AWS Cloud Intern) @ Employability.life</h3>
                                <p className="text-sm text-zinc-400 mb-1">April 2025 - June 2025</p>
                                <p className="text-gray-400 text-sm mb-3">
                                    - Developed and executed test cases for EC2, S3, and Lambda-based cloud workflows.
                                </p>
                                <p className="text-gray-400 text-sm">
                                    - Simulated IAM policies to verify user access controls and resource protection.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </AnimatedSection>
                <AnimatedSection>
                    <div id="skills" className="py-12 scroll-mt-28">
                        <h2 className="text-3xl font-bold mb-8 text-left">Skills & Technologies</h2>
                        <div className="relative group">
                            <button onClick={() => scrollSkills('left')} className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-50 bg-zinc-700 hover:bg-zinc-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <FaChevronLeft />
                            </button>
                            <div ref={skillScrollRef} className="flex space-x-6 overflow-x-scroll no-scrollbar px-4 md:px-12 py-4">
                                {skillsData.map(skill => <SkillCard key={skill.name} {...skill} />)}
                            </div>
                            <button onClick={() => scrollSkills('right')} className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-50 bg-zinc-700 hover:bg-zinc-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <FaChevronRight />
                            </button>
                        </div>
                    </div>
                </AnimatedSection>
                <AnimatedSection>
                    <div id="projects" className="py-12 scroll-mt-28">
                        <h2 className="text-3xl font-bold mb-4 text-left">Featured Projects</h2>
                        {renderProjects(recruiterProjects)}
                    </div>
                </AnimatedSection>
                <AnimatedSection>
                    <div id="education" className="py-12 scroll-mt-28">
                        <h2 className="text-3xl font-bold mb-8 text-left">Education</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <motion.div whileHover={{ scale: 1.05 }} className="bg-zinc-900 rounded-xl p-6 border border-zinc-700 transition-transform duration-300">
                                <h3 className="text-xl font-bold text-red-500">Sister Nivedita University, Kolkata</h3>
                                <p className="text-gray-400">B.Tech, Computer Science & Engineering</p>
                                <p className="text-gray-500 text-sm mt-1">2022 - 2026</p>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} className="bg-zinc-900 rounded-xl p-6 border border-zinc-700 transition-transform duration-300">
                                <h3 className="text-xl font-bold text-red-500">St. Thomas' High School, Dasnagar</h3>
                                <p className="text-gray-400">ISC (Class 12) & ICSE (Class 10)</p>
                                <p className="text-gray-500 text-sm mt-1">2007 - 2021</p>
                            </motion.div>
                        </div>
                    </div>
                </AnimatedSection>
                <AnimatedSection>
                  <div id="certifications" className="py-12 scroll-mt-28">
                      <h2 className="text-3xl font-bold mb-8 text-left">Certifications</h2>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {certificationsData.map((cert, index) => (
                              <a key={index} href={cert.link} target="_blank" rel="noopener noreferrer">
                                  <motion.div
                                      whileHover={{ scale: 1.05, zIndex: 10, backgroundColor: 'rgb(31 41 55 / 1)' }}
                                      className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 h-full flex flex-col transition-all duration-300 cursor-pointer relative overflow-hidden"
                                  >
                                      {/* Background Logo (Subtle) */}
                                      {cert.logo && (
                                          <div className="absolute top-2 right-2 opacity-10">
                                              <img 
                                                  src={cert.logo} 
                                                  alt={`${cert.issuer} logo`}
                                                  className="w-12 h-12 object-contain"
                                              />
                                          </div>
                                      )}
                                      
                                      {/* Content Container */}
                                      <div className="relative z-10 flex items-start space-x-3">
                                          {/* Prominent Logo */}
                                          {cert.logo && (
                                              <div className="flex-shrink-0">
                                                  <img
                                                      src={cert.logo}
                                                      alt={`${cert.issuer} logo`}
                                                      className="w-8 h-8 object-contain bg-white rounded-md p-1"
                                                      onError={(e) => {
                                                        (e.currentTarget as HTMLImageElement).style.display = 'none';   // cast
                                                        console.error('Logo failed to load:', cert.logo);
                                                      }}
                                                  />
                                              </div>
                                          )}
                                          
                                          {/* Text Content */}
                                          <div className="flex-grow">
                                              <p className="font-semibold text-white flex-grow">{cert.title}</p>
                                              <p className="text-sm text-red-400 mt-2">{cert.issuer}</p>
                                          </div>
                                      </div>
                                      
                                      {/* External Link Icon */}
                                      <div className="absolute bottom-3 right-3">
                                          <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                          </svg>
                                      </div>
                                  </motion.div>
                              </a>
                          ))}
                      </div>
                  </div>
              </AnimatedSection>
                <AnimatedSection>
                    <div id="hire-me" className="py-12 scroll-mt-28">
                        <h2 className="text-3xl font-bold mb-6 text-left">Want to Reach Out?</h2>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setShowContact(true)} className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-500 transition font-semibold">
                                Open Contact Form
                            </button>
                            <button onClick={() => setShowReachOut(true)} className="px-6 py-3 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition font-semibold">
                                Quick Contact Info
                            </button>
                        </div>
                    </div>
                </AnimatedSection>
                </>
            )}
             {role === 'Adventurer' && (
                <>
                    {renderTopPicks(role)}
                    <AnimatedSection>
                        <div id="projects-adventurer" className="py-12">
                            <h2 className="text-3xl font-bold mb-4 text-left">The Explorer's Log: Projects</h2>
                            {renderProjects(adventurerProjects)}
                        </div>
                    </AnimatedSection>
                    
                    <AdventurerCarousel
                      id="unfinished-but-interesting"
                      title="Unfinished but Interesting"
                      description="A collection of raw ideas and works-in-progress. These are the sketches in my notebook—some might become masterpieces, others are just for practice."
                      items={adventurerSectionCards.unfinished}
                      onItemClick={openAdventurerItem}
                    />

                    <AdventurerCarousel
                      id="achievements"
                      title="Achievements"
                      description="Forged in the fires of caffeine and collaboration. Here are my achievements."
                      items={adventurerSectionCards.achievements}
                      onItemClick={openAdventurerItem}
                    />

                    <AnimatedSection>
                      <div id="tech-stack" className="py-12 scroll-mt-24">
                        <h2 className="text-3xl font-bold mb-8 text-left">Tech Stack & Tools</h2>
                        <div className="relative group">
                          <button onClick={() => scrollSkills('left')} className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-50 bg-zinc-700 hover:bg-zinc-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <FaChevronLeft />
                          </button>
                          <div ref={skillScrollRef} className="flex space-x-6 overflow-x-scroll no-scrollbar px-4 md:px-12 py-4">
                              {skillsData.map(skill => <SkillCard key={skill.name} {...skill} />)}
                          </div>
                          <button onClick={() => scrollSkills('right')} className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-50 bg-zinc-700 hover:bg-zinc-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <FaChevronRight />
                          </button>
                        </div>
                      </div>
                    </AnimatedSection>

                    <AnimatedSection>
                      <div id="blog" className="py-12 scroll-mt-24">
                        <h2 className="text-3xl font-bold mb-4 text-left">Blog</h2>
                        <p className="text-gray-400">Field notes from my expeditions into code. Musings on technology, design, and discovery. <span className="text-red-500 font-semibold">(Coming Soon!)</span></p>
                      </div>
                    </AnimatedSection>

                    <AdventurerCarousel
                      id="what-if-playground"
                      title='"What If" Playground'
                      description="This is where I explore speculative ideas and conceptual prototypes. What if a UI was made of liquid? What if a button could predict your next move? Let's find out."
                      items={adventurerSectionCards.playground}
                      onItemClick={openAdventurerItem}
                    />

                    <AdventurerCarousel
                      id="tools-i-built-for-myself"
                      title="Tools I Built for Myself"
                      description="Every explorer needs custom gear. These are the small utilities, scripts, and personal apps I've built to streamline my own workflow and solve my own problems."
                      items={adventurerSectionCards.tools}
                      onItemClick={setSelectedAdventurerItem}
                    />

                    <AdventurerCarousel
                      id="weird-ux-demos"
                      title="Weird UX Demos"
                      description="Breaking the rules to see what happens. A collection of unconventional, strange, and sometimes impractical user interface experiments. Enter at your own risk!"
                      items={adventurerSectionCards.weirdUX}
                      onItemClick={setSelectedAdventurerItem}
                    />

                    {/* NEW: Adventurer Games Section */}
                    <AnimatedSection>
                      <div id="the-arcade" className="py-12 scroll-mt-24">
                         {/* Dynamic Header */}
                        <h2 className="text-3xl font-bold mb-4 text-left flex items-center gap-2">
                          <span className="text-yellow-500">🕹️</span> The Arcade
                        </h2>
                        <p className="text-gray-400 mb-8">
                          Take a break from the code. Interactive experiments and mini-games designed for explorers.
                        </p>
                        
                        {/* We reuse the AdventurerCarousel but pass game data */}
                        <AdventurerCarousel
                          id="arcade-carousel"
                          title=""
                          description=""
                          items={adventurerGames}
                          onItemClick={(game: GameItem) => {
                            setSelectedGame(game);
                            setIsGameModalOpen(true);
                          }}
                        />
                      </div>
                    </AnimatedSection>

                    {/* Connect with Me */}
                    <AnimatedSection>
                      <div id="connect-with-me" className="py-12 scroll-mt-24">
                        <h2 className="text-3xl font-bold mb-6 text-left">Connect with Me</h2>
                        <p className="text-gray-400 mb-8">Ready to collaborate on something amazing? Let's build the future together.</p>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* Contact Card */}
                          <motion.div
                            whileHover={{ scale: 1.05, zIndex: 10 }}
                            onClick={() => setShowContact(true)}
                            className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 h-40 flex flex-col justify-center items-center text-center transition-all duration-300 cursor-pointer hover:border-red-500"
                          >
                            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mb-3">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.94a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-1">Send Message</h3>
                            <p className="text-sm text-gray-400">Open contact form</p>
                          </motion.div>

                          {/* Quick Contact Card */}
                          <motion.div
                            whileHover={{ scale: 1.05, zIndex: 10 }}
                            onClick={() => setShowReachOut(true)}
                            className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 h-40 flex flex-col justify-center items-center text-center transition-all duration-300 cursor-pointer hover:border-blue-500"
                          >
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-3">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-1">Quick Contact</h3>
                            <p className="text-sm text-gray-400">Get my details instantly</p>
                          </motion.div>

                          {/* LinkedIn Card */}
                          <motion.div
                            whileHover={{ scale: 1.05, zIndex: 10 }}
                            className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 h-40 flex flex-col justify-center items-center text-center transition-all duration-300 cursor-pointer hover:border-blue-400"
                          >
                            <a
                              href="https://www.linkedin.com/in/diptaraj-sinha-b2270b256/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-col items-center"
                            >
                              <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center mb-3">
                                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                              </div>
                              <h3 className="text-lg font-semibold text-white mb-1">LinkedIn</h3>
                              <p className="text-sm text-gray-400">Professional network</p>
                            </a>
                          </motion.div>

                          {/* GitHub Card */}
                          <motion.div
                            whileHover={{ scale: 1.05, zIndex: 10 }}
                            className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 h-40 flex flex-col justify-center items-center text-center transition-all duration-300 cursor-pointer hover:border-gray-400"
                          >
                            <a
                              href="https://github.com/DiptarajSinha"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-col items-center"
                            >
                              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-3">
                                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                                </svg>
                              </div>
                              <h3 className="text-lg font-semibold text-white mb-1">GitHub</h3>
                              <p className="text-sm text-gray-400">Code repository</p>
                            </a>
                          </motion.div>

                          {/* Instagram Card */}
                          <motion.div
                            whileHover={{ scale: 1.05, zIndex: 10 }}
                            className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 h-40 flex flex-col justify-center items-center text-center transition-all duration-300 cursor-pointer hover:border-pink-500"
                          >
                            <a
                              href="https://instagram.com/your.diptaraj"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-col items-center"
                            >
                              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full flex items-center justify-center mb-3">
                                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                              </div>
                              <h3 className="text-lg font-semibold text-white mb-1">Instagram</h3>
                              <p className="text-sm text-gray-400">Visual stories</p>
                            </a>
                          </motion.div>

                          {/* Portfolio Card */}
                          <motion.div
                            whileHover={{ scale: 1.05, zIndex: 10 }}
                            onClick={handleRandomRole}
                            className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 h-40 flex flex-col justify-center items-center text-center transition-all duration-300 cursor-pointer hover:border-red-500"
                          >
                            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mb-3">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-1">Explore More</h3>
                            <p className="text-sm text-gray-400">Try different roles</p>
                          </motion.div>
                        </div>
                      </div>
                    </AnimatedSection>
                </>
            )}
             {role === 'Stalker' && (
              <>
                {showTypingAnimation && isFirstVisit ? (
                <TypingTerminal onComplete={handleTypingComplete} />
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  // FIXED: 
                  // 1. 'p-3 sm:p-4' -> Less padding on mobile
                  // 2. 'text-xs sm:text-base' -> Smaller font on mobile so lines fit
                  // 3. 'space-y-1' -> Tighter line spacing
                  className="bg-gradient-to-r from-red-900/20 to-black p-3 sm:p-4 rounded-lg text-left font-stalker text-xs sm:text-base text-green-400 border-2 border-red-800/50 hover:border-red-600 transition-all shadow-[0_0_30px_rgba(255,0,0,0.3)] tracking-wide space-y-1 sm:space-y-2"
                >
                  <div className="flex items-center gap-2 mb-2 sm:mb-4 pb-1 sm:pb-0">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-400 font-bold">SURVEILLANCE ACTIVE</span>
                  </div>
                  
                  {/* The text inside will now inherit text-xs (mobile) / text-base (desktop) */}
                  <p className="text-red-300">[SYSTEM INITIALIZED]</p>
                  <p>{getTime()} Tracing IP address... <span className="text-yellow-400">COMPLETE</span></p>
                  <p>{getTime()} Location: <span className="text-red-400">[CLASSIFIED]</span></p>
                  <p>{getTime()} Matching biometric data... <span className="text-yellow-400">PROCESSING</span></p>
                  <p>{getTime()} Target identified: <span className="text-green-400">VISITOR_ID_7439</span></p>
                  <p>{getTime()} Behavioral pattern: <span className="text-blue-400">CURIOUS_EXPLORER</span></p>
                  <p>{getTime()} Threat assessment: <span className="text-green-400">MINIMAL</span></p>
                  <p>{getTime()} Access granted: <span className="text-green-400">WELCOME_TO_THE_SHADOWS</span></p>
                  <p className="text-gray-500 mt-2 sm:mt-4">👁️ We see everything...</p>
                </motion.div>
              )}        
                
                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => triggerStalkerError('CRITICAL_ERROR: NODE_SHUTDOWN_BY_ADMIN')} 
                    className={`${buttonBase} bg-red-600 text-white font-mono w-full sm:w-auto shadow-[0_0_15px_rgba(220,38,38,0.4)]`}
                  >
                    BREACH PROTOCOL
                  </button>
                  <button 
                    onClick={() => triggerStalkerError('SIGNAL_LOST: ENCRYPTION_TOO_STRONG')} 
                    className={`${buttonBase} bg-purple-600 text-white font-mono w-full sm:w-auto shadow-[0_0_15px_rgba(147,51,234,0.4)]`}
                  >
                    INITIATE TRACE
                  </button>
                </div>

                {/* Floating Error Popup UI */}
                <AnimatePresence>
                  {stalkerError && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[2000] bg-red-600 text-white px-6 py-3 font-stalker border-2 border-white shadow-[0_0_30px_rgba(255,0,0,0.6)] uppercase text-sm tracking-tighter"
                    >
                      ⚠️ {stalkerError}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {renderTopPicks(role)}

                {/* Suspicious Activity */}
                <StalkerCarousel
                  id="suspicious-activity"
                  title="🔍 Suspicious Activity"
                  description="Real-time monitoring of anomalous behavior patterns and security threats."
                  items={stalkerSectionCards.suspicious}
                  onItemClick={setSelectedStalkerItem}
                  hoverEffect="glitch"
                />

                {/* Logs */}
                <StalkerCarousel
                  id="logs"
                  title="📊 System Logs"
                  description="Comprehensive activity logs and access records from all monitored systems."
                  items={stalkerSectionCards.logs}
                  onItemClick={setSelectedStalkerItem}
                  hoverEffect="hack"
                />

                {/* Secrets */}
                <StalkerCarousel
                  id="secrets"
                  title="🔐 Classified Secrets"
                  description="Encrypted data vaults and confidential information repositories."
                  items={stalkerSectionCards.secrets}
                  onItemClick={setSelectedStalkerItem}
                  hoverEffect="decrypt"
                />

                {/* Unknown Projects */}
                <StalkerCarousel
                  id="unknown-projects"
                  title="❓ Unknown Projects"
                  description="Unidentified projects and experimental technologies under investigation."
                  items={stalkerSectionCards.unknown}
                  onItemClick={(item: any) => {
                    // Manually tagging as restricted
                    setSelectedStalkerItem({ ...item, isRestricted: true });
                  }}
                  hoverEffect="phantom"
                />

                {/* Dark Mode */}
                <StalkerCarousel
                  id="dark-mode"
                  title="🌙 Shadow Interface Lab"
                  description="Experimental dark interfaces and stealth user experience research."
                  items={stalkerSectionCards.darkmode}
                  onItemClick={setSelectedStalkerItem}
                  hoverEffect="shadow"
                />

                {/* Classified */}
                <StalkerCarousel
                  id="classified"
                  title="😈 Level 9 Classified"
                  description="[REDACTED] - Maximum security clearance required for access."
                  items={stalkerSectionCards.classified}
                  onItemClick={(item: any) => {
                    // Manually tagging as restricted
                    setSelectedStalkerItem({ ...item, isRestricted: true });
                  }}
                  hoverEffect="corrupt"
                />

                {/* NEW: Stalker Mind Games Section */}
                <StalkerCarousel
                  id="mind-games"
                  title="🧠 Mind Games"
                  description="Simulation drills to sharpen your cognitive breach protocols."
                  items={stalkerGames}
                  onItemClick={(game: GameItem) => {
                    setSelectedGame(game);
                    setIsGameModalOpen(true);
                  }}
                  hoverEffect="glitch"
                />

                {/* Follow Me */}
                <AnimatedSection>
                  <div id="surveillance-network" className="py-12 scroll-mt-24">
                    {/* FIXED: Header font */}
                    <h2 className="text-4xl font-bold mb-6 text-left text-red-500 font-stalker tracking-wider">👁️ Digital Surveillance Network</h2>
                    {/* FIXED: Subtitle font */}
                    <p className="text-gray-400 mb-8 italic font-stalker text-xl">Join the watchers. Become part of the network.</p>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {stalkerSectionCards.follow.map((item: any, index: any) => (
                        <motion.div
                          key={item.id}
                          whileHover={{ 
                            scale: 1.05, 
                            boxShadow: '0 0 30px rgba(255, 0, 0, 0.4)',
                            backgroundColor: 'rgba(20, 20, 20, 0.9)'
                          }}
                          onClick={() => setSelectedStalkerItem(item)}
                          className="bg-zinc-900 border border-red-800/50 rounded-lg p-4 h-60 flex flex-col justify-between transition-all duration-300 cursor-pointer font-stalker"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              item.accessLevel === 'top-secret' ? 'bg-red-900 text-red-200' :
                              'bg-yellow-900 text-yellow-200'
                            }`}>
                              {item.accessLevel?.toUpperCase()}
                            </span>
                            <div className={`w-3 h-3 rounded-full ${
                              item.threatLevel === 'critical' ? 'bg-red-500 animate-pulse' :
                              item.threatLevel === 'high' ? 'bg-orange-500' :
                              'bg-yellow-500'
                            }`} />
                          </div>
                          
                          <div>
                            {/* Added tracking-wide and font-stalker */}
                            <h3 className="text-2xl font-semibold text-red-300 mb-2 font-stalker tracking-wide">{item.title}</h3>
                            <p className="text-lg text-gray-400 flex-grow font-stalker">{item.description}</p>
                          </div>
                          
                          <div className="flex justify-between items-end text-sm text-gray-500 mt-4 font-stalker">
                            <span>STATUS: {item.status?.toUpperCase()}</span>
                            <span>{item.lastAccessed}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>

                {/* Follow Me - Social Media Tracking */}
                <AnimatedSection>
                  <div id="follow-me" className="py-12 scroll-mt-24">
                    <h2 className="text-4xl font-bold mb-6 text-left text-red-500 font-stalker tracking-wider">👁️ Follow Me</h2>
                    <p className="text-gray-400 mb-8 italic font-stalker text-xl">Track my digital footprint across social platforms. Every click is monitored.</p>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* GitHub Surveillance */}
                      <motion.div
                        whileHover={{ 
                          scale: 1.1, 
                          boxShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
                          backgroundColor: 'rgba(15, 15, 15, 0.9)'
                        }}
                        className="bg-zinc-900 border border-red-800/50 rounded-lg p-6 h-48 flex flex-col justify-center items-center text-center transition-all duration-300 cursor-pointer font-stalker hover:border-gray-400"
                      >
                        <a
                          href="https://github.com/DiptarajSinha"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center w-full"
                        >
                          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-3 border border-gray-600">
                            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                            </svg>
                          </div>
                          {/* INCREASED FONT SIZE HERE */}
                          <h3 className="text-xl font-semibold text-gray-300 mb-1 tracking-wide">CODE VAULT</h3>
                          <p className="text-base text-red-400">MONITORING ACTIVE</p>
                        </a>
                      </motion.div>

                      {/* LinkedIn Surveillance */}
                      <motion.div
                        whileHover={{ 
                          scale: 1.1, 
                          boxShadow: '0 0 30px rgba(0, 119, 181, 0.4)',
                          backgroundColor: 'rgba(0, 30, 60, 0.3)'
                        }}
                        className="bg-zinc-900 border border-red-800/50 rounded-lg p-6 h-48 flex flex-col justify-center items-center text-center transition-all duration-300 cursor-pointer font-stalker hover:border-blue-400"
                      >
                        <a
                          href="https://www.linkedin.com/in/diptaraj-sinha-b2270b256/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center w-full"
                        >
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-3 border border-blue-500">
                            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </div>
                          {/* INCREASED FONT SIZE HERE */}
                          <h3 className="text-xl font-semibold text-gray-300 mb-1 tracking-wide">PROFESSIONAL NET</h3>
                          <p className="text-base text-blue-400">TARGET ACQUIRED</p>
                        </a>
                      </motion.div>

                      {/* Instagram Surveillance */}
                      <motion.div
                        whileHover={{ 
                          scale: 1.1, 
                          boxShadow: '0 0 30px rgba(225, 48, 108, 0.4)',
                          backgroundColor: 'rgba(60, 20, 40, 0.3)'
                        }}
                        className="bg-zinc-900 border border-red-800/50 rounded-lg p-6 h-48 flex flex-col justify-center items-center text-center transition-all duration-300 cursor-pointer font-stalker hover:border-pink-500"
                      >
                        <a
                          href="https://instagram.com/__diptooo__"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center w-full"
                        >
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full flex items-center justify-center mb-3 border border-pink-400">
                            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </div>
                          {/* INCREASED FONT SIZE HERE */}
                          <h3 className="text-xl font-semibold text-white mb-1 tracking-wide">VISUAL INTEL</h3>
                          <p className="text-base text-pink-400">SURVEILLANCE ON</p>
                        </a>
                      </motion.div>

                      {/* Email Contact */}
                      <motion.div
                        whileHover={{ 
                          scale: 1.1, 
                          boxShadow: '0 0 30px rgba(255, 0, 0, 0.4)',
                          backgroundColor: 'rgba(40, 0, 0, 0.3)'
                        }}
                        onClick={() => setShowContact(true)}
                        className="bg-zinc-900 border border-red-800/50 rounded-lg p-6 h-48 flex flex-col justify-center items-center text-center transition-all duration-300 cursor-pointer font-stalker hover:border-red-500"
                      >
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mb-3 border border-red-500">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.94a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        {/* INCREASED FONT SIZE HERE */}
                        <h3 className="text-xl font-semibold text-gray-300 mb-1 tracking-wide">DIRECT CHANNEL</h3>
                        <p className="text-base text-red-400">ENCRYPTED COMM</p>
                      </motion.div>

                    </div>

                    {/* Stalker-style monitoring stats */}
                    <div className="mt-8 bg-black/50 border border-red-800/30 rounded-base p-4 font-stalker text-base tracking-wide">
                      <div className="flex flex-col sm:flex-row justify-between text-gray-500 gap-2">
                        <span>ACTIVE SURVEILLANCE: <span className="text-green-400">ENABLED</span></span>
                        <span>TARGETS TRACKED: <span className="text-yellow-400">4</span></span>
                        <span>DATA COLLECTED: <span className="text-red-400">∞</span></span>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              </>
            )}
        </section>
      </div>
      
      <AdventurerModal 
        item={selectedAdventurerItem} 
        onClose={() => setSelectedAdventurerItem(null)} 
      />
      
      <StalkerModal 
        item={selectedStalkerItem} 
        onClose={() => setSelectedStalkerItem(null)} 
      />

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />

      <GameModal 
        game={selectedGame}
        isOpen={isGameModalOpen}
        onClose={() => setIsGameModalOpen(false)}
        theme={role === 'Stalker' ? 'Stalker' : 'Adventurer'}
      />

      <AnimatePresence>
        {showReachOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center px-4"
            style={{ top: 0, height: '100vh', position: 'fixed' }}
            onClick={() => setShowReachOut(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 rounded-xl p-8 shadow-xl max-w-md w-full relative border border-zinc-700"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowReachOut(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <h3 className="text-2xl font-bold mb-6 text-white">Reach Out to Me</h3>
              <div className="space-y-4 text-gray-300 font-mono text-sm sm:text-base">
                <p>
                  <strong className="text-white">Email:</strong><br />
                  <a href="mailto:diptarajsinha1014@gmail.com" className="text-red-400 hover:underline break-all">diptarajsinha1014@gmail.com</a>
                </p>
                <p>
                  <strong className="text-white">LinkedIn:</strong><br />
                  <a href="https://www.linkedin.com/in/diptaraj-sinha-b2270b256/" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline break-all">
                    linkedin.com/in/diptaraj-sinha-b2270b256/
                  </a>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <MobileWarning />
    </main>
  );
}