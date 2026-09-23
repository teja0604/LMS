import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {

  const location = useLocation();

  const isCoursesListPage = location.pathname.includes('/course-list');

  const { backendUrl, isEducator, setIsEducator, navigate, getToken } = useContext(AppContext)

  const { openSignIn } = useClerk()
  const { user } = useUser()

  const becomeEducator = async () => {

    try {

      if (isEducator) {
        navigate('/educator')
        return;
      }

      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/update-role', { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        toast.success(data.message)
        setIsEducator(true)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <nav className={`sticky top-0 z-50 flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-[#DCE5E3] py-3.5 transition-colors ${isCoursesListPage ? 'bg-white/95' : 'bg-[#EAF7F6]/95'} backdrop-blur-md shadow-subtle`}>
      <img onClick={() => navigate('/')} src={assets.logo} alt="EduLearn Pro" className="w-32 lg:w-36 cursor-pointer hover:opacity-95 transition-opacity" />
      <div className="md:flex hidden items-center gap-6 text-[#637278]">
        <div className="flex items-center gap-5 text-sm font-medium">
          {
            user && <>
              <button onClick={becomeEducator} className="hover:text-[#0E3A43] transition-colors">{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
              <span className="text-[#DCE5E3]">|</span>
              <Link to='/my-enrollments' className="hover:text-[#0E3A43] transition-colors">My Enrollments</Link>
            </>
          }
        </div>
        {user
          ? <UserButton />
          : <button onClick={() => openSignIn()} className="btn-primary text-sm font-medium px-5 py-2.5 rounded-full">
            Create Account
          </button>}
      </div>
      {/* For Phone Screens */}
      <div className='md:hidden flex items-center gap-2 sm:gap-4 text-[#637278]'>
        <div className="flex items-center gap-2 text-xs font-medium">
          <button onClick={becomeEducator} className="hover:text-[#0E3A43] transition-colors">{isEducator ? 'Educator' : 'Become Educator'}</button>
          {user && (
            <>
              <span className="text-[#DCE5E3]">|</span>
              <Link to='/my-enrollments' className="hover:text-[#0E3A43] transition-colors">My Enrollments</Link>
            </>
          )}
        </div>
        {user
          ? <UserButton />
          : <button onClick={() => openSignIn()} className="p-1.5 rounded-full hover:bg-[#F3D8CC]/40 transition-colors" aria-label="Sign In">
            <img src={assets.user_icon} alt="User Account" className="w-6 h-6" />
          </button>}
      </div>
    </nav>
  );
};

export default Navbar;