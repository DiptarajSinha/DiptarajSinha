import { SiNextdotjs, SiTypescript, SiJavascript, SiReact, SiNodedotjs, SiPython, SiPostgresql, SiTailwindcss, SiVercel } from "react-icons/si";
import { TbBrandCSharp } from "react-icons/tb";

// --- DATA CONSTANTS ---

export const skillsData = [
  { name: 'Python', icon: <SiPython size={48} />, bg: 'from-blue-500/10 to-zinc-900' },
  { name: 'React', icon: <SiReact size={48} />, bg: 'from-cyan-400/10 to-zinc-900' },
  { name: 'Next.js', icon: <SiNextdotjs size={48} />, bg: 'from-white/10 to-zinc-900' },
  { name: 'JavaScript', icon: <SiJavascript size={48} />, bg: 'from-yellow-400/10 to-zinc-900' },
  { name: 'TypeScript', icon: <TbBrandCSharp size={48} />, bg: 'from-blue-400/10 to-zinc-900' },
  { name: 'Node.js', icon: <SiNodedotjs size={48} />, bg: 'from-green-400/10 to-zinc-900' },
  { name: 'Tailwind CSS', icon: <SiTailwindcss size={48} />, bg: 'from-sky-400/10 to-zinc-900' },
];

export const certificationsData = [
    { title: 'AI Developer', issuer: 'IBM', link: 'https://www.coursera.org/account/accomplishments/specialization/UKY0RGMQEFVJ?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=prof', logo: '/logos/ibm-logo.png' },
    { title: 'Building LLM Applications With Prompt Engineering', issuer: 'NVIDIA', link: 'https://drive.google.com/file/d/1gbt45g6tXw_qreCMoLMmRvYNR0CeZ1HH/view?usp=sharing', logo: '/logos/nvidia-logo.png' },
    { title: 'IT Automation with Python', issuer: 'Google', link: 'https://coursera.org/share/be045371143510c2a6f42a3c166d57a1', logo: '/logos/google-logo.png' },
    { title: 'Introduction to Generative AI Learning Path', issuer: 'Google Cloud', link: 'https://www.coursera.org/account/accomplishments/specialization/QCN5573VBDPK?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=s12n', logo: '/logos/google-cloud-logo.png' },
    { title: 'Introduction to DevOps', issuer: 'IBM', link: 'https://coursera.org/share/45567af4981e70027202854dd77e632b', logo: '/logos/ibm-logo.png' },
    { title: 'Data Analysis with Python', issuer: 'IBM', link: 'https://www.coursera.org/account/accomplishments/verify/YT14DJYIKRNB?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=course', logo: '/logos/ibm-logo.png' },
    { title: 'Introduction to Android Mobile Application Development', issuer: 'Meta', link: 'https://coursera.org/share/9aeda90de8051eee1a932e82f943c1ef', logo: '/logos/meta-logo.jpg' },
    { title: 'Gen AI in Software Development', issuer: 'Amazon', link: 'https://coursera.org/share/5c02f300f88e65e73d81c8dc584ebc59', logo: '/logos/amazon-logo.png' },
    { title: 'Responsive Website Basics', issuer: 'University of London', link: 'https://coursera.org/share/0ee6d5fdcd95c2f75b0907de3ad8ad38', logo: '/logos/london-logo.jpeg' },
    { title: 'IT Security', issuer: 'Google', link: 'https://coursera.org/share/ae173d986913d217e03fa9b2d3fbdaaf', logo: '/logos/google-logo.png' },
    { title: 'Applied ML in Python', issuer: 'University of Michigan', link: 'https://www.coursera.org/account/accomplishments/verify/AMMARC3L96I5?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=course', logo: '/logos/michigan-logo.png' },
    { title: 'SQL', issuer: 'University of Colorado Boulder', link: 'https://www.coursera.org/account/accomplishments/verify/Z4JUVTB418PB?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=course', logo: '/logos/colorado-logo.png' },
    { title: 'Hands-on Introduction to Linux Commands and Shell Scripting', issuer: 'IBM', link: 'https://coursera.org/share/70373ef10b753c055462d40494370a84', logo: '/logos/ibm-logo.png' },
    { title: 'People and Soft Skills for Professional and Personal Success', issuer: 'IBM', link: 'https://coursera.org/share/4a10af41023df6fd6653fd3180377a14', logo: '/logos/ibm-logo.png' },
];

export const topPickBackgrounds: Record<string, string[]> = {
    Recruiter: [
      '/bg/recruiter-1.png', '/bg/recruiter-2.png', '/bg/recruiter-3.png',
      '/bg/recruiter-4.png', '/bg/recruiter-5.png', '/bg/recruiter-6.png',
    ],
    Adventurer: [
      '/bg/adventurer-1.png', '/bg/adventurer-2.png', '/bg/adventurer-3.png',
      '/bg/adventurer-4.png', '/bg/adventurer-5.png', '/bg/adventurer-6.png',
      '/bg/adventurer-7.png', '/bg/adventurer-8.png', '/bg/adventurer-9.png', 
      '/bg/adventurer-10.png',
    ],
    Stalker: [
      '/bg/stalker-1.png', '/bg/stalker-2.png', '/bg/stalker-3.png',
      '/bg/stalker-4.png', '/bg/stalker-5.png', '/bg/stalker-6.png',
      '/bg/stalker-7.png', '/bg/stalker-8.png',
    ],
  };

export const topPicksByRole: Record<string, string[]> = {
    Recruiter: ['Skills', 'Experience', 'Projects', 'Certifications', 'Education', 'Hire Me'],
    Adventurer: ['Projects', 'Unfinished but Interesting', 'Achievements', 'Tech Stack', 'Blog', '"What If" Playground', 'Tools I Built for Myself', 'Weird UX Demos', 'The Arcade', 'Connect with Me'],
    Stalker: ['Suspicious Activity', 'Logs', 'Secrets', 'Unknown Projects', 'Dark Mode', 'Classified', 'Surveillance Network', 'Mind Games',  'Follow me']
};