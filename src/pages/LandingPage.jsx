import React, { useEffect, useRef } from "react";
import Typed from "typed.js";
import { Link } from "react-router-dom"; 
import landing from "../assets/landing.png";

function LandingPage() {
  const typedRef = useRef(null);

  useEffect(() => {
    const options = {
      strings: [
        "Solusi mager untuk penghuni kutek...",
        "Belanja mudah, aman, dan cepat...",
        "Koleksi terbaru setiap hari...",
      ],
      loop: true,
      typeSpeed: 50,
      backSpeed: 50,
      backDelay: 2000,
    };

    if (typedRef.current) {
      const typed = new Typed(typedRef.current, options);
      return () => {
        typed.destroy();
      };
    }
  }, []);

  return (

    <div className="w-full overflow-hidden relative"> 

      <section id="home" className="min-h-[calc(100vh-80px)] container mx-auto px-4 py-16 relative z-10 flex flex-col md:flex-row items-center justify-center gap-x-0">
        <div className="w-full flex justify-center mb-8 md:mb-0 md:order-last relative md:flex-1">
           <img src={landing} alt="Online Shop Illustration" className="w-full h-auto max-w-sm md:max-w-xl lg:max-w-3xl relative z-10 animate-spin-slow" />

           <div className="absolute inset-0 flex items-center justify-center z-0">
             <div className="absolute w-24 h-24 md:w-48 md:h-48 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 dark:opacity-50 top-4 left-4 md:top-10 md:left-10"></div>
             <div className="absolute w-24 h-24 md:w-48 md:h-48 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-30 dark:opacity-50 bottom-4 right-4 md:bottom-10 md:right-10"></div>
             <div className="absolute w-24 h-24 md:w-48 md:h-48 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-30 dark:opacity-50 bottom-8 left-8 md:bottom-20 md:left-20"></div>
           </div>

        </div>

        <div className="w-full flex flex-col items-center md:items-start justify-center text-center md:text-left md:flex-1">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4 text-gray-900 dark:text-white">
            Mau belanja, <br className="hidden md:block" /> di KUTEK aja!
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 italic min-h-[2.5em]">
             <span ref={typedRef}></span>
          </p>
          
          <Link
            to="/login" 
            className="px-10 py-3 rounded-full bg-gradient-to-br from-blue-800 via-blue-500 to-blue-700 hover:from-blue-900 hover:via-blue-700 hover:to-blue-900 text-white font-semibold rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-lg"
          >
            Mulai Belanja
          </Link>
        </div>
      </section>

    </div>
  );
}

export default LandingPage;