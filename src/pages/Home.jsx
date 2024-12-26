import React from 'react';
import FeatureHighlight from '../components/Feature';
import "../index.css";
import { motion } from 'framer-motion';
import { AiOutlineCode, AiOutlineCloudUpload, AiOutlinePlayCircle, AiOutlineUser } from 'react-icons/ai';
import { BiPaint, BiSearch, BiTerminal } from 'react-icons/bi';
import { MdOutlineBrush, MdOutlineSettings, MdChat } from 'react-icons/md';

export default function Home() {
  const highlights = [
    {
      icon: <AiOutlineCode className="text-purple-500 text-5xl" />, // Adjusted shades
      title: "Run Any Programming Language",
      description: "Seamlessly execute code in over 30+ languages with blazing-fast performance."
    },
    {
      icon: <MdOutlineBrush className="text-purple-400 text-5xl" />,
      title: "Multiple Themes",
      description: "Choose from vibrant themes to create your perfect coding atmosphere."
    },
    {
      icon: <AiOutlinePlayCircle className="text-purple-500 text-5xl" />,
      title: "Advanced Code Editor",
      description: "Enjoy intelligent bracket matching, code wrapping, and customizable settings."
    },
    {
      icon: <AiOutlineCloudUpload className="text-purple-400 text-5xl" />,
      title: "Flexible Input Options",
      description: "Upload files, drag and drop, or manually input text with ease."
    },
    {
      icon: <MdOutlineSettings className="text-purple-500 text-5xl" />,
      title: "Customizable Workspace",
      description: "Organize your IDE with resizable file menu, terminal, and editor sections."
    },
    {
      icon: <BiSearch className="text-purple-400 text-5xl" />,
      title: "Enhanced Search Tools",
      description: "Use advanced search, find, and replace to navigate your code effortlessly."
    },
    {
      icon: <AiOutlineUser className="text-purple-500 text-5xl" />,
      title: "Guest & Authenticated Access",
      description: "Explore as a guest or unlock premium features as an authenticated user."
    },
    {
      icon: <BiTerminal className="text-purple-400 text-5xl" />,
      title: "Integrated Terminal",
      description: "Run commands and debug your code seamlessly within the browser."
    },
    {
      icon: <MdChat className="text-purple-500 text-5xl" />,
      title: "AI Chatbot Support",
      description: "Chat with an AI-powered assistant to resolve your coding doubts instantly."
    }
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-100 to-purple-200 font-sans min-h-screen overflow-hidden text-gray-900"> {/* Adjusted colors */}
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-5 sticky top-0 z-50 border-b border-purple-300 bg-white shadow-md">
        <motion.h1
          className="text-4xl font-extrabold tracking-wide"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-purple-600">CodeBoard</span> IDE
        </motion.h1>
        <motion.div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "#6b46c1" }}
            className="flex items-center bg-purple-600 text-white px-5 py-3 rounded-full shadow-lg font-semibold transition-transform transform hover:bg-purple-500 hover:shadow-2xl"
            onClick={() => window.location.href = '/login'}
          >
            <AiOutlineUser className="mr-2 text-xl" /> Login
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "#6b46c1" }}
            className="flex items-center bg-purple-600 text-white px-5 py-3 rounded-full shadow-lg font-semibold transition-transform transform hover:bg-purple-500 hover:shadow-2xl"
            onClick={() => window.location.href = '/guest'}
          >
            <AiOutlinePlayCircle className="mr-2 text-xl" /> Explore
          </motion.button>
        </motion.div>
      </header>

      {/* Hero Section */}
      <motion.section
        className="relative bg-gradient-to-br from-white to-purple-100 py-20 px-6 pb-0 text-center border border-purple-500 rounded-lg shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-tight drop-shadow-lg">
            Unleash Your Coding Potential
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Dive into a next-generation coding experience with a focus on beautiful design, intuitive features, and unmatched flexibility.
          </p>
          <div className="flex justify-center items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="bg-purple-600 text-white px-8 py-4 rounded-full shadow-lg font-medium hover:bg-purple-500 transition-transform transform"
              onClick={() => window.location.href = '/guest'}
            >
              Explore as Guest
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="bg-transparent border border-purple-600 text-purple-600 px-8 py-4 rounded-full shadow-lg font-medium hover:bg-purple-500 hover:text-white transition-transform transform"
              onClick={() => window.location.href = '/signup'}
            >
              Sign Up for Free
            </motion.button>
          </div>
        </motion.div>
        <motion.div
          className="mt-12 flex justify-center items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <img
            src="./ide.png"
            alt="IDE Mockup"
            className="w-[86vw] h-auto rounded-2xl rounded-b-none shadow-2xl border border-purple-500"
          />
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <main className="py-16 px-6 md:px-12 lg:px-20">
        <h3 className="text-4xl font-bold text-center text-purple-700 mb-12 underline">Why Choose CodeBoard?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {highlights.map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 bg-purple-50 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow transform hover:-translate-y-2 border border-purple-300 overflow-hidden relative"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="text-center mb-4 relative z-10">{feature.icon}</div>
              <h4 className="text-2xl font-bold text-center mb-2 text-purple-800 relative z-10">{feature.title}</h4>
              <p className="text-gray-700 text-center relative z-10">{feature.description}</p>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-purple-100 rounded-3xl opacity-10"></div>
            </motion.div>
          ))}
        </div>
      </main>


      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-400 py-8 border-t border-purple-300">
        <motion.div
          className="container mx-auto text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <p className="mb-4 text-lg">&copy; 2024 CodeBoard IDE. Elevate Your Coding Experience.</p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="hover:text-purple-400 text-xl">Terms</a>
            <a href="#" className="hover:text-purple-400 text-xl">Privacy</a>
            <a href="#" className="hover:text-purple-400 text-xl">Contact</a>
          </div>
        </motion.div>
      </footer>
    </div>
  );
}
