import React from 'react';
import { assets } from '../../assets/assets';

const Companies = () => {
  return (
    <div className="pt-10 pb-6 px-6 max-w-6xl mx-auto">
      <p className="text-xs uppercase tracking-wider font-semibold text-[#637278]">Trusted by teams and learners from top companies</p>
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 md:mt-8 mt-5">
        <img className='md:w-28 w-20 hover:scale-105 transition-transform duration-200' src={assets.microsoft_logo} alt="Microsoft" />
        <img className='md:w-28 w-20 hover:scale-105 transition-transform duration-200' src={assets.walmart_logo} alt="Walmart" />
        <img className='md:w-24 w-20 hover:scale-105 transition-transform duration-200' src={assets.accenture_logo} alt="Accenture" />
        <img className='md:w-24 w-20 hover:scale-105 transition-transform duration-200' src={assets.adobe_logo} alt="Adobe" />
        <img className='md:w-24 w-20 hover:scale-105 transition-transform duration-200' src={assets.paypal_logo} alt="PayPal" />
      </div>
    </div>
  );
};

export default Companies;
