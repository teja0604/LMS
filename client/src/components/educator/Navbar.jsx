import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { UserButton, useUser } from '@clerk/clerk-react';

const Navbar = ({ bgColor }) => {

  const { isEducator } = useContext(AppContext)
  const { user } = useUser()

  return isEducator && user && (
    <nav className={`flex items-center justify-between px-4 md:px-8 border-b border-[#DCE5E3] py-3.5 bg-white shadow-subtle ${bgColor || ''}`}>
      <Link to="/" className="flex items-center gap-2">
        <img src={assets.logo} alt="EduLearn Pro" className="w-32 lg:w-36" />
      </Link>
      <div className="flex items-center gap-4 text-[#637278] text-sm font-medium relative">
        <p className="hidden sm:block">Welcome, <span className="text-[#17252A] font-semibold">{user.fullName}</span></p>
        <UserButton />
      </div>
    </nav>
  );
};

export default Navbar;