'use client';

import { TypeAnimation } from 'react-type-animation';

const TypewriterRecruiter = () => {
  return (
    <TypeAnimation
      sequence={[
        // Start typing in white
        'Recruiter',
        1000, // Wait 1 second
        // Use a callback to change the color to red
        (el) => {
          if (el) el.style.color = '#EF4444'; // Tailwind's red-500
        },
        3000, // Wait 3 seconds with the red color
        // Use a callback to change it back to white before deleting
        (el) => {
            if (el) el.style.color = 'white';
        },
        // Delete the text
        '',
        500, // Wait before starting the loop again
      ]}
      wrapper="span"
      speed={40}
      cursor={true}
      repeat={Infinity}
    />
  );
};

export default TypewriterRecruiter;