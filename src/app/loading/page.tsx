'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoadingPage() {
  const [message, setMessage] = useState('Loading...');
  // Default states for styling
  const [fontClass, setFontClass] = useState('font-sans'); 
  const [themeColor, setThemeColor] = useState('text-white border-white');
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const rawRoleFromUrl = searchParams.get('role');
    const roleFromStorage = localStorage.getItem('selectedRole');

    let finalRole: string | null = null;

    if (rawRoleFromUrl) {
      finalRole = rawRoleFromUrl.charAt(0).toUpperCase() + rawRoleFromUrl.slice(1).toLowerCase();
      localStorage.setItem('selectedRole', finalRole);
    } else if (roleFromStorage) {
      finalRole = roleFromStorage;
    }

    // 1. Define Message Map
    const messageMap: Record<string, string> = {
      Recruiter: 'Polishing my resume for you...',
      Stalker: 'ACCESSING SECURE SERVER...', // Changed to fit the "Hacker" vibe better
      Adventurer: 'Warming up the engines...',
    };

    // 2. Set Message
    setMessage(messageMap[finalRole || ''] || 'Loading...');

    // 3. Apply Fonts and Colors based on Role
    if (finalRole === 'Stalker') {
      setFontClass('font-stalker tracking-widest uppercase'); // Hacker font
      setThemeColor('text-red-500 border-red-500');
    } else if (finalRole === 'Adventurer') {
      setFontClass('font-adventurer tracking-wide'); // Adventure font
      setThemeColor('text-yellow-500 border-yellow-500');
    } else {
      setFontClass('font-sans tracking-normal'); // Default clean font
      setThemeColor('text-white border-white');
    }

    const timer = setTimeout(() => {
      router.push('/'); 
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, searchParams]);

  return (
    // Added 'px-6' for mobile padding so text doesn't touch edges
    <main className="min-h-screen flex flex-col items-center justify-center bg-black px-6 text-center">
      
      {/* - responsive text size: text-xl (mobile) -> text-3xl (desktop) 
         - dynamic font class and text color 
      */}
      <div className={`text-xl md:text-3xl mb-8 font-bold animate-pulse ${fontClass} ${themeColor.split(' ')[0]}`}>
        {message}
      </div>

      {/* - Loader matches the theme color automatically
         - Responsive size: w-12 (mobile) -> w-16 (desktop)
      */}
      <div className={`w-12 h-12 md:w-16 md:h-16 border-4 border-t-transparent rounded-full animate-spin ${themeColor.split(' ')[1]}`}></div>
    </main>
  );
}