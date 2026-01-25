'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoadingContent() {
  const [message, setMessage] = useState('Loading...');
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

    const messageMap: Record<string, string> = {
      Recruiter: 'Polishing my resume for you...',
      Stalker: 'ACCESSING SECURE SERVER...',
      Adventurer: 'Warming up the engines...',
    };

    setMessage(messageMap[finalRole || ''] || 'Loading...');

    if (finalRole === 'Stalker') {
      setFontClass('font-stalker tracking-widest uppercase');
      setThemeColor('text-red-500 border-red-500');
    } else if (finalRole === 'Adventurer') {
      setFontClass('font-adventurer tracking-wide');
      setThemeColor('text-yellow-500 border-yellow-500');
    } else {
      setFontClass('font-sans tracking-normal');
      setThemeColor('text-white border-white');
    }

    const timer = setTimeout(() => {
      router.push('/'); 
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, searchParams]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black px-6 text-center">
      <div className={`text-xl md:text-3xl mb-8 font-bold animate-pulse ${fontClass} ${themeColor.split(' ')[0]}`}>
        {message}
      </div>

      <div className={`w-12 h-12 md:w-16 md:h-16 border-4 border-t-transparent rounded-full animate-spin ${themeColor.split(' ')[1]}`}></div>
    </main>
  );
}

export default function LoadingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <LoadingContent />
    </Suspense>
  );
}