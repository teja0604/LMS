import React from 'react';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className="flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-8 py-4 border-t border-[#DCE5E3] bg-white">
      <div className='flex items-center gap-4'>
        <img className='hidden md:block w-24' src={assets.logo} alt="EduLearn Pro" />
        <div className='hidden md:block h-6 w-px bg-[#DCE5E3]'></div>
        <p className="text-center text-xs md:text-sm text-[#637278]">
          Copyright 2024 © EduLearn Pro. All Right Reserved.
        </p>
      </div>
      <div className='flex items-center gap-3 max-md:mb-3'>
        <a href="#" className="p-1.5 rounded-full hover:bg-[#F3D8CC]/40 transition-colors" aria-label="Facebook">
          <img src={assets.facebook_icon} alt="facebook" className="w-4 h-4" />
        </a>
        <a href="#" className="p-1.5 rounded-full hover:bg-[#F3D8CC]/40 transition-colors" aria-label="Twitter">
          <img src={assets.twitter_icon} alt="twitter" className="w-4 h-4" />
        </a>
        <a href="#" className="p-1.5 rounded-full hover:bg-[#F3D8CC]/40 transition-colors" aria-label="Instagram">
          <img src={assets.instagram_icon} alt="instagram" className="w-4 h-4" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;