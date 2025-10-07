// src/components/Hero/WarmUpHero.jsx (Pixel Perfect)
import React from "react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 bg-no-repeat bg-cover bg-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero-bg-vid.mp4" type="video/mp4" />
      </video>
      <div className="max-w-3xl mx-auto px-6 text-center z-10">
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-none ">
          Warm Up,
          <br />
          Chill Out
        </h1>

        <p className="text-lg md:text-xl text-white mb-16 max-w-md mx-auto leading-snug">
          Daily Outerwear for Mixed Weather and Moving in Comfort.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button className="bg-white text-text px-12 py-4 text-base font-normal hover:bg-gray-300 transition-colors w-40">
            Men's
          </button>
          <button className="bg-white text-text px-12 py-4 text-base font-normal hover:bg-gray-300 transition-colors w-40">
            Women's
          </button>
          <button className="border border-white text-white px-12 py-4 text-base font-normal hover:bg-white hover:text-black transition-colors w-40">
            Explore
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
