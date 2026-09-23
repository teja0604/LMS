import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

const SideBar = () => {

  const { isEducator } = useContext(AppContext)

  const menuItems = [
    { name: 'Dashboard', path: '/educator', icon: assets.home_icon },
    { name: 'Add Course', path: '/educator/add-course', icon: assets.add_icon },
    { name: 'My Courses', path: '/educator/my-courses', icon: assets.my_course_icon },
    { name: 'Student Enrolled', path: '/educator/student-enrolled', icon: assets.person_tick_icon },
  ];

  return isEducator && (
    <aside className='md:w-64 w-16 border-r min-h-screen text-sm border-[#DCE5E3] py-4 flex flex-col bg-white'>
      {menuItems.map((item) => (
        <NavLink
          to={item.path}
          key={item.name}
          end={item.path === '/educator'}
          className={({ isActive }) =>
            `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-6 gap-3 transition-all ${isActive
              ? 'bg-[#F7F7F2] text-[#0E3A43] font-semibold border-r-[4px] border-[#0E3A43]'
              : 'text-[#637278] hover:bg-[#F7F7F2]/60 hover:text-[#0E3A43] border-r-[4px] border-transparent'
            }`
          }
        >
          <img src={item.icon} alt="" className="w-5 h-5 opacity-80" />
          <p className='md:block hidden'>{item.name}</p>
        </NavLink>
      ))}
    </aside>
  );
};

export default SideBar;