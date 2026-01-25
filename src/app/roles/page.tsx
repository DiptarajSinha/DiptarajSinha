'use client';

import { useRouter } from 'next/navigation';

const roles = [
  { label: 'Recruiter', image: '/avatars/recruiter.jpg' },
  { label: 'Stalker', image: '/avatars/stalker.jpg' },
  { label: 'Adventurer', image: '/avatars/adventurer.jpg' },
];

export default function RoleSelector() {
  const router = useRouter();

  const handleSelect = (role: string) => {
    localStorage.setItem('selectedRole', role);
    router.push('/loading');
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-12">
      <h1 className="text-4xl font-semibold">Who's Watching?</h1>

      <div className="flex gap-10 justify-center">
        {roles.map(({ label, image }, index) => (
          <div
            key={label}
            onClick={() => handleSelect(label)}
            className={`cursor-pointer flex flex-col items-center transition-transform duration-300 transform hover:scale-105`}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <img
            src={image}
            alt={label}
            className={`w-44 h-44 object-cover rounded-xl border-4 border-transparent hover:border-white hover:drop-shadow-[0_0_15px_#ffffffaa] avatar-pop`}
            style={{ animationDelay: `${index * 0.2}s` }}
            />
            <p className="mt-4 text-lg font-semibold">{label}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
