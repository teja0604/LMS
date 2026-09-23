import React from 'react';
import { assets } from '../../assets/assets';
import SearchBar from '../../components/student/SearchBar';

const Hero = () => {
  return (
    <section className="flex flex-col items-center justify-center w-full md:pt-32 pt-16 pb-16 px-6 md:px-8 space-y-7 text-center bg-gradient-to-b from-[#EAF7F6] via-[#F3F8F7] to-[#F7F7F2] animate-fade-in-up">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#A84B2A]/20 text-[#A84B2A] text-xs md:text-sm font-medium shadow-xs backdrop-blur-xs">
        <span className="w-2 h-2 rounded-full bg-[#A84B2A]"></span>
        Next-Generation LMS Platform
      </div>
      
      <h1 className="md:text-home-heading-large text-home-heading-small relative font-bold text-[#17252A] max-w-3xl mx-auto leading-tight pb-3">
        Empower your future with the courses designed to
        <span className="text-[#A84B2A] relative inline-block">
          &nbsp;fit your choice.
        </span>
        <img 
          src={assets.sketch} 
          alt="" 
          className="md:block hidden absolute -bottom-4 right-0 max-w-[214px] w-auto pointer-events-none -z-0 select-none" 
        />
      </h1>
      
      <p className="md:block hidden text-[#637278] max-w-2xl mx-auto text-base leading-relaxed">
        We bring together world-class instructors, interactive content, and a supportive community to help you achieve your personal and professional goals with EduLearn Pro.
      </p>
      <p className="md:hidden text-[#637278] max-w-sm mx-auto text-sm leading-relaxed">
        We bring together world-class instructors to help you achieve your professional goals.
      </p>
      
      <div className="w-full pt-2 flex justify-center">
        <SearchBar />
      </div>
    </section>
  );
};

export default Hero;
