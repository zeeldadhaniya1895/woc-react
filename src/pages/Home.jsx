import FeatureHighlight from '../components/Feature';
import "../index.css"

import React from 'react';

export default function Home() {
    return (
        <div className="bg-gray-50 font-sans min-h-screen">
            {/* Header */}
            <header className="flex justify-between items-center px-8 py-5 bg-gradient-to-l from-[#A294F9] via-[#CDC1FF] to-[#E5D9F2] text-black shadow-lg">
                <h1 className="text-3xl font-extrabold tracking-wide">Online IDE</h1>
                <button 
                    className="bg-white text-[#A294F9] px-6 py-2 rounded-full shadow-md font-semibold hover:bg-[#A294F9] hover:text-white transition-transform transform hover:scale-105"
                    onClick={() => window.location.href = '/login'}
                >
                    Login
                </button>
            </header>

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-50 to-gray-100 py-20 px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-5xl font-extrabold text-gray-800 mb-6 leading-tight">Your Ultimate Online Coding Platform</h2>
                    <p className="text-lg text-gray-600 mb-8">Build, debug, and collaborate on code seamlessly from any device. Experience powerful tools and real-time features designed to enhance your development journey.</p>
                    <button className="bg-[#A294F9] text-white px-8 py-3 rounded-full shadow-lg font-medium hover:bg-[#A294F9] transition-transform transform hover:scale-105" onClick={() => window.location.href = '/guest'}>
                        Get Started for Free
                    </button>
                </div>
                <div className="mt-12 flex justify-center items-center">
                    <img src="/assets/hero-mockup.png" alt="IDE Mockup" className="max-w-full h-auto rounded-lg shadow-lg" />
                </div>
            </section>

            {/* Features Section */}
            <main className="py-16 px-6 md:px-12 lg:px-20">
                <FeatureHighlight 
                    title="Why Choose Our IDE?"
                    description="Discover cutting-edge features designed to streamline your coding workflow."
                    features={highlights}
                />
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-8">
                <div className="container mx-auto text-center">
                    <p className="mb-4">&copy; 2024 Online IDE. All Rights Reserved.</p>
                    <div className="flex justify-center space-x-4">
                        <a href="#" className="hover:text-white">Terms</a>
                        <a href="#" className="hover:text-white">Privacy</a>
                        <a href="#" className="hover:text-white">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

const highlights = [
    {
        icon: "fas fa-code",
        title: "Powerful Code Editor",
        description: "Write code effortlessly with syntax highlighting, autocomplete, and an intuitive interface."
    },
    {
        icon: "fas fa-users",
        title: "Real-Time Collaboration",
        description: "Work with your team in real time with multi-user editing and integrated chat."
    },
    {
        icon: "fas fa-robot",
        title: "AI Assistance",
        description: "Leverage AI-powered code suggestions to write better code faster."
    },
    {
        icon: "fas fa-terminal",
        title: "Integrated Terminal",
        description: "Run your code seamlessly and view output instantly with an in-browser terminal."
    }
];
