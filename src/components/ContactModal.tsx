'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  // Reset form state when modal is reopened
  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setForm({ name: '', email: '', message: '' });
    }
  }, [isOpen]);

  // Prevent background from scrolling when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup style on component unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('https://formspree.io/f/xjkorbbb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => onClose(), 2000);
      } else {
        setError('Failed to send message. Please try again.');
      }
    } catch (err) {
      setError('Error sending message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          // This is the overlay. It closes the modal when clicked.
          className="absolute left-0 top-0 w-full min-h-screen z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center px-4"
          style={{ top: window.scrollY }} // <-- Your working positioning logic
          onClick={onClose} // <-- This enables click-outside-to-close
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            // This is the modal content. It stops the click from propagating to the overlay.
            className="bg-zinc-950 text-white w-full max-w-md p-6 rounded-xl border border-gray-700 shadow-lg"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Contact Me</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <p className="text-green-400 text-lg">✅ Message sent successfully!</p>
                <p className="text-gray-400 mt-2">I'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  className="bg-zinc-800 p-3 rounded text-sm text-white focus:ring-2 focus:ring-red-500 outline-none"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleChange}
                  className="bg-zinc-800 p-3 rounded text-sm text-white focus:ring-2 focus:ring-red-500 outline-none"
                  required
                />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={form.message}
                  onChange={handleChange}
                  className="bg-zinc-800 p-3 rounded text-sm text-white focus:ring-2 focus:ring-red-500 outline-none"
                  rows={4}
                  required
                ></textarea>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-red-600 hover:bg-red-500 disabled:bg-red-400 text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}