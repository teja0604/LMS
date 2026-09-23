import React from 'react';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className="bg-[#0E3A43] md:px-36 px-6 text-left w-full mt-16 text-[#D5E0E1]">
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 md:gap-16 py-12 border-b border-white/15 max-w-7xl mx-auto">

        <div className="flex flex-col md:items-start items-center w-full md:max-w-xs">
          <img src={assets.logo_dark} alt="EduLearn Pro" className="w-36" />
          <p className="mt-5 text-center md:text-left text-sm text-[#D5E0E1] leading-relaxed">
            EduLearn Pro is a modern learning platform delivering world-class curriculum, practical projects, and verifiable credentials.
          </p>
        </div>

        <div className="flex flex-col md:items-start items-center w-full md:w-auto">
          <h2 className="font-semibold text-[#FFFFFF] text-base mb-4">Company</h2>
          <ul className="flex md:flex-col gap-4 md:gap-2 text-sm text-[#E6EFEE]">
            <li><a href="#" className="hover:text-[#F3D8CC] transition-colors">Home</a></li>
            <li><a href="#" className="hover:text-[#F3D8CC] transition-colors">About us</a></li>
            <li><a href="#" className="hover:text-[#F3D8CC] transition-colors">Contact us</a></li>
            <li><a href="#" className="hover:text-[#F3D8CC] transition-colors">Privacy policy</a></li>
          </ul>
        </div>

        <div className="hidden md:flex flex-col items-start w-full md:max-w-sm">
          <h2 className="font-semibold text-[#FFFFFF] text-base mb-4">Subscribe to our newsletter</h2>
          <p className="text-sm text-[#D5E0E1] leading-relaxed">
            The latest tutorials, course updates, and tech resources, sent directly to your inbox.
          </p>
          <div className="flex items-center gap-2 pt-4 w-full">
            <input 
              className="border border-[#DCE5E3]/20 bg-[#155965]/80 text-[#FFFFFF] placeholder-[#D5E0E1]/60 outline-none w-full h-10 rounded-lg px-3 text-sm focus:border-[#F3D8CC] transition-colors" 
              type="email" 
              placeholder="Enter your email" 
            />
            <button className="bg-[#A84B2A] hover:bg-[#A84B2A]/90 h-10 px-5 text-white font-medium text-sm rounded-lg transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>

      </div>
      <p className="py-6 text-center text-xs md:text-sm text-[#D5E0E1]/80">
        Copyright 2024 © EduLearn Pro. All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
